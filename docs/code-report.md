---
geometry: margin=25mm
title: SR - Exercise 05 - Code Vulnerabilities
subtitle: Report
author: Team 8 - Diogo Matos, Tiago Silvestre, David Araujo
date: November 25, 2023
---

# Table of Contents
1. [Introduction](#introduction)
2. [Code reviewd by us](#code-reviewed-by-us)
3. [Code reviewed by the other team](#code-reviewed-by-the-other-team)


# Introduction
In this small report we present 

# Code reviewed by us

| Team | Score | Observations |
| :-: | :-: | - |
| 3 | 1 | The code was very small and simple. There was no effort on disguise any error/vulnerability or in approximating the code to a plausible _real-life_ implementation. |

# Code reviewed by the other team

| Team | Score | Observations |
| :-: | :-: | - |
| 1 | | |

## Developed application

Our code exposes the following attacks:

- **SQL Injection** - For the registration process, a query for the existing usernames is made to prevent username collision and a response header is created to inform of collisions status. This SQL query however, does not sanitize the user input, allowing the system to expose all usernames in said header field.
- **JWT Token Forgery** - The JSON Web Signature (JWS) specification describes an optional `jwk` header parameter, which servers can use to embed their public key directly within the token itself in JWK format. Ideally, servers should only use a limited whitelist of public keys to verify JWT signatures. However, misconfigured servers sometimes use any key that's embedded in the `jwk` parameter. This allows any attacker to self-sign tokens, which in turn allows the attacker to forge tokens freely.
- **OS Command Injection** - If a user with the admin role access the endpoint `/studentsByClass`, the system will perform a backup of the database. This field is checked from the token provided, and concatenates the role in the token to the backup file name created via a OS command. If the attacker already has the power to forge tokens (previous vulnerability), and has discovered the necessary token field, `role`, the attacker can modify this field's value to inject OS-level commands.

From [OWASP's Secure Coding Practices Checklist](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/stable-en/02-checklist/05-checklist) the three vulnerabilities implemented fall under the following categories:

- Validate all client provided data before processing;
- Contextually sanitize all output of un-trusted data to queries for SQL, XML, and LDAP;
- Sanitize all output of untrusted data to operating system commands;
- Use only trusted system objects, e.g. server side session objects, for making access authorization decisions;
- Protect secrets from unauthorized access.