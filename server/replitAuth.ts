// Authentication with direct OAuth providers: Google, GitHub, LinkedIn
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { storage } from "./storage";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  
  // Create a PostgreSQL Pool with WebSocket support for session storage
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
  });
  
  pool.on('error', (err: Error) => {
    console.error('Session pool error:', err);
  });
  
  const sessionStore = new pgStore({
    pool: pool,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  // Only update refresh_token if a new one is provided (refresh responses may not include it)
  if (tokens.refresh_token) {
    user.refresh_token = tokens.refresh_token;
  }
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  // Google OAuth Strategy (if credentials are provided)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const googleVerify: any = async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const user = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
          claims: {
            sub: `google:${profile.id}`,
            email: profile.emails?.[0]?.value || "",
            first_name: profile.name?.givenName || "",
            last_name: profile.name?.familyName || "",
            profile_image_url: profile.photos?.[0]?.value || "",
          },
        };
        
        await upsertUser(user.claims);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    };

    // Determine the correct callback URL based on environment
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || "localhost:5000";
    const protocol = domain === "localhost" || domain.includes("localhost:") ? "http" : "https";
    const callbackURL = `${protocol}://${domain}/api/callback/google`;

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: callbackURL,
          scope: ["email", "profile"],
        },
        googleVerify
      )
    );
  }

  // GitHub OAuth Strategy (if credentials are provided)
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const githubVerify: any = async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const user = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
          claims: {
            sub: `github:${profile.id}`,
            email: profile.emails?.[0]?.value || profile._json?.email || "",
            first_name: profile.displayName?.split(" ")[0] || "",
            last_name: profile.displayName?.split(" ").slice(1).join(" ") || "",
            profile_image_url: profile.photos?.[0]?.value || profile._json?.avatar_url || "",
          },
        };
        
        await upsertUser(user.claims);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    };

    // Determine the correct callback URL based on environment
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || "localhost:5000";
    const protocol = domain === "localhost" || domain.includes("localhost:") ? "http" : "https";
    const callbackURL = `${protocol}://${domain}/api/callback/github`;

    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: callbackURL,
          scope: ["user:email"],
        },
        githubVerify
      )
    );
  }

  // LinkedIn OAuth Strategy (if credentials are provided)
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    const linkedInVerify: any = async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const user = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
          claims: {
            sub: `linkedin:${profile.id}`,
            email: profile.emails?.[0]?.value || "",
            first_name: profile.name?.givenName || "",
            last_name: profile.name?.familyName || "",
            profile_image_url: profile.photos?.[0]?.value || "",
          },
        };
        
        await upsertUser(user.claims);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    };

    // Determine the correct callback URL based on environment
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || "localhost:5000";
    const protocol = domain === "localhost" || domain.includes("localhost:") ? "http" : "https";
    const callbackURL = `${protocol}://${domain}/api/callback/linkedin`;

    passport.use(
      new LinkedInStrategy(
        {
          clientID: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          callbackURL: callbackURL,
          scope: ["email", "profile", "openid"],
        },
        linkedInVerify
      )
    );
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    const provider = req.query.provider as string;
    
    // For backwards compatibility, fallback to Replit Auth if no direct provider is configured
    if (!provider || ['google', 'github'].includes(provider)) {
      passport.authenticate(`replitauth:${req.hostname}`, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } else {
      res.status(400).json({ error: "Invalid provider" });
    }
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  // Google OAuth routes (only if credentials are configured)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get("/api/login/google", (req, res, next) => {
      passport.authenticate("google", { scope: ["email", "profile"] })(req, res, next);
    });

    app.get("/api/callback/google", (req, res, next) => {
      passport.authenticate("google", {
        successReturnToOrRedirect: "/",
        failureRedirect: "/",
      })(req, res, next);
    });
  }

  // GitHub OAuth routes (only if credentials are configured)
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    app.get("/api/login/github", (req, res, next) => {
      passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
    });

    app.get("/api/callback/github", (req, res, next) => {
      passport.authenticate("github", {
        successReturnToOrRedirect: "/",
        failureRedirect: "/",
      })(req, res, next);
    });
  }

  // LinkedIn OAuth routes (only if credentials are configured)
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    app.get("/api/login/linkedin", (req, res, next) => {
      passport.authenticate("linkedin")(req, res, next);
    });

    app.get("/api/callback/linkedin", (req, res, next) => {
      passport.authenticate("linkedin", {
        successReturnToOrRedirect: "/",
        failureRedirect: "/",
      })(req, res, next);
    });
  }

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
