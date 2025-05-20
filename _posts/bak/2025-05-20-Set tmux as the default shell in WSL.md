---
title: Set tmux as the default shell in WSL
tags: [linux,tmux]
date: '2025-05-20'
published: true
layout: post
excerpt: trest
comments: false
thumbnail: japan.jpg
---

To set **tmux** as your default shell on WSL Linux, you can modify your shell's configuration file. Here's a step-by-step guide:

1. **Locate Your Shell Configuration File**:
   
       If you're using Bash, open the `.bashrc` file:
        
        ```bash
        nano ~/.bashrc
        
        ```
        
     If you're using Zsh, open the `.zshrc` file:
        
        ```bash
        nano ~/.zshrc
        
        ```
        
3.  **Add Conditional Statements**:
At the end of the file, add the following code:
    
    ```bash
    if command -v tmux &> /dev/null && [ -z "$TMUX" ]; then
        tmux attach-session -t default || tmux new-session -s default
    fi
    
    ```
    
    This ensures that:
    
     **Tmux is installed** (`command -v tmux`).
     **You're not already in a tmux session** (`[ -z "$TMUX" ]`).
     It tries to attach to an existing session named `default` or creates a new one.
4.  **Save and Exit**:
Press `Ctrl+O` to save and `Ctrl+X` to exit the editor.
5.  **Apply Changes**:
Run the following command to apply the changes:
    
    ```bash
    source ~/.bashrc
    
    ```
    
    Or restart your terminal.
