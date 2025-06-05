---
title: Remote Code Execution via Evernote Windows App
tags: [rce, windows]
date: '2025-06-05'
published: true
layout: post
excerpt: trest
comments: false
thumbnail: japan.jpg
---

# Introduction

I just want to share a pretty interesting security issue I found back on September 29, 2019 while messing around with Evernote’s Windows app. It’s a potential remote code execution (RCE) vulnerability that takes advantage of Git for Windows’ Bash emulator. If you’re a developer using Evernote to share notes, this might be something you want to be aware of.
The Discovery
Most developers use Git for version control—according to the 2018 Stack Overflow survey, 87% of 74,298 respondents said they were using Git. If you’re working on Windows, chances are you’ve come across Git Bash, which lets you execute Bash commands in a Windows environment.
Here’s where things get interesting. Evernote lets you attach files to notes and share them with others. Normally, if you attach a  file, Evernote displays a security prompt before running it, which helps prevent accidental execution. But when I tested  files (used in Bash scripting), I realized that Evernote doesn’t give any kind of warning—it just opens Git Bash and runs the script. This means someone could attach a malicious  file to a note, send it to an unsuspecting developer, and—boom—their machine executes it without asking.

# Proof of Concept
To demonstrate the vulnerability, I performed the following steps:
1. Create a .sh script containing a simple command `echo "hello,evernote vuln"`
2. Attached the script to a note in Evernote's Windows app
3. Open the attached script from evernote, which launched git bash and executed the script immediately without any script prompt.
if a malicious actor used this method, they could attach a .sh script with harmful commands such as installing malware and exfiltrating data leading to a serious security risk.
[![Proof of Concept Video](https://img.youtube.com/vi/vmccHU_ghHc/0.jpg)](https://www.youtube.com/watch?v=vmccHU_ghHc)

# How to Fix It

There are a few straightforward ways to mitigate this issue:

- **Implement a Security Prompt:** Evernote should warn users before executing .sh scripts, similar to how it handles .exe files.
- **Restrict Script Execution:** Instead of auto-launching Git Bash, Evernote could block execution of .sh scripts or require explicit user permission.
- **Enhance File-Type Handling:** Git for Windows could update security policies to prevent unauthorized execution of scripts via third-party apps like Evernote.

