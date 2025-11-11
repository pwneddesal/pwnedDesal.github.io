---
title: Cracking the Intigriti Monthly Code Challenge – Bypassing 2FA
tags:
  - ctf
  - bugbounty
  - chall
date: 2025-11-11T00:00:00
published: true
layout: post
excerpt: trest
comments: false
thumbnail: japan.jpg
---


The Intigriti Monthly Code Challenge is an exciting opportunity for security enthusiasts to test their skills and win some cool swag! This month’s challenge focuses on bypassing a Two-Factor Authentication (2FA) verification — a critical security feature designed to add an extra layer of protection beyond just a username and password.

In this challenge, participants are given an Express.js application with session-based username/password authentication and a separate HTTP server dedicated to handling 2FA on port 8085. After a successful login, the server issues a session cookie, which is necessary for the 2FA verification step. The goal? To find a method to bypass or trick the 2FA process and gain unauthorized access.
```javascript
import express, { Express, Request, Response } from 'express';
import session from 'express-session';

// ------------------------------------------------
// 1. DEFINE THE SESSION INTERFACE
// ------------------------------------------------
interface Session {
    userId: string; 
    token: string;
}

// ------------------------------------------------
// 2. EXTEND EXPRESS REQUEST FOR 'session' PROPERTY
// ------------------------------------------------
declare module 'express-session' {
    interface SessionData {
        userId: string;
        token: string;
    }
}

const app: Express = express();
const port = process.env.PORT || 8080;

// ------------------------------------------------
// 3. ADD SESSION MIDDLEWARE (THIS WAS MISSING!)
// ------------------------------------------------
app.use(session({
    secret: 'your-secret-key-here', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

app.use(express.json());

async function VerifyMFACode(session: Session, c: number): Promise<boolean> {
    return await fetch(`http://localhost:8085/api/verify/${session.userId}/${c}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.token}`
        }
    }).then(async (res) => {
        if (!res.ok) {
            console.error('Failed to verify 2FA Code!');
            return false;
        }
        return res.status === 200;
    });
}

// ------------------------------------------------
// 4. ADD A LOGIN ENDPOINT TO CREATE SESSIONS
// ------------------------------------------------
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    // TODO: Verify username/password against your database
    // This is a simplified example
    if (username && password) {
        // Set session data
        req.session.userId = username; // Or fetch from database
        req.session.token = 'some-auth-token'; // Generate proper token
        
        res.json({ 
            success: true, 
            message: 'Login successful. Please complete 2FA.' 
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// ------------------------------------------------
// 5. THE 2FA ENDPOINT (NOW WITH WORKING SESSION)
// ------------------------------------------------
app.post('/api/auth/2fa', async (req: Request, res: Response) => {
    const session = req.session as Session;
    console.log('Session:', session);
    
    const { code }: { code: number } = req.body;
    
    if (!session?.userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        console.log('No session found');
        return;
    }
    
    const valid: boolean = await VerifyMFACode(session, code); 
    
    res.set({ 'Content-Type': 'application/json; charset=utf-8' });
    res.send(JSON.stringify({ success: valid }));
});

// ------------------------------------------------
// 6. OPTIONAL: LOGOUT ENDPOINT
// ------------------------------------------------
app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Logout failed' });
        } else {
            res.json({ success: true, message: 'Logged out' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
```

The challenge revolves around how the 2FA verification is implemented. The verification code is passed as part of the URL path to the backend server. Normally, an invalid or incorrect 2FA code results in a failed verification with a non-200 HTTP status code, while a successful verification returns HTTP 200.

```javascript
async function VerifyMFACode(session: Session, c: number): Promise<boolean> {
    return await fetch(`http://localhost:8085/api/verify/${session.userId}/${c}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.token}`
        }
    }).then(async (res) => {
        if (!res.ok) {
            console.error('Failed to verify 2FA Code!');
            return false;
        }
        return res.status === 200;
    });
}

```

The key insight lies in exploiting the way the server processes the URL path. By manipulating the request URL—specifically, using path reversal techniques and adjusting the 2FA code from a path parameter to a query parameter—the participant can trick the server into returning a success response. Initially, appending the 2FA code directly to the URL path resulted in a 404 error. **However, replacing the trailing number with a query parameter (using a question mark) transformed the request into a valid GET parameter.** This subtle but powerful change bypassed the intended verification logic and allowed the server to respond with a success message, effectively bypassing the 2FA check.
```php
//payload 1
../../../../?999999
//payload 2
?999999
```


This challenge is a fantastic example of how overlooked URL parsing and request routing quirks can undermine even well-intentioned security measures like 2FA. It underscores the importance of secure coding practices, thorough input validation, and careful handling of URL parameters in web applications.

<iframe width="560" height="315" src="https://www.youtube.com/embed/WprqX0qVlbU?si=0sqg1WVC_trViDfl&amp;start=3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>