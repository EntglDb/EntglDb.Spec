# Contributing to EntglDb

Thank you for your interest in contributing to EntglDb! 
This repository hosts the **Core Specifications** and the **Documentation Website**.

## How to Contribute

### 1. Improvements to Specifications
The artifacts in the `spec/` folder are the source of truth for all EntglDb implementations.
*   **Fixes**: Typographical errors or clarifications are always welcome.
*   **Protocol Changes**: Any change to the wire protocol or data model must be discussed in an Issue first. Breaking changes require version bumping across all ecosystem libraries.

### 2. Website Updates
*   The website is built with **Vue 3 + TypeScript**.
*   We use **Vanilla CSS** for styling (Premium/Dark theme). Please respect the existing variables in `style.css`.
*   To preview changes locally:
    ```bash
    cd website
    npm run dev
    ```

## Pull Request Process
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
