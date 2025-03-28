Contributing to SENTINEL AEGIS
Thank you for your interest in contributing to SENTINEL AEGIS! This document provides guidelines and instructions for contributing to the project.

Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. Please read CODE_OF_CONDUCT.md before contributing.

How to Contribute
Reporting Bugs
Check if the bug has already been reported in the Issues
If not, create a new issue with a descriptive title and clear description
Include steps to reproduce, expected behavior, and actual behavior
Add relevant screenshots or logs if applicable
Use the "bug" label
Suggesting Enhancements
Check if the enhancement has already been suggested in the Issues
If not, create a new issue with a descriptive title and clear description
Explain why this enhancement would be useful
Use the "enhancement" label
Pull Requests
Fork the repository
Create a new branch from main
Make your changes
Run tests to ensure your changes don't break existing functionality
Submit a pull request to the main branch
Reference any related issues in your pull request description
Development Setup
Clone your fork of the repository
Install dependencies:
bash

Hide
pip install -r requirements.txt
cd dashboard
npm install
Set up pre-commit hooks:
bash

Hide
pre-commit install
Coding Standards
Python
Follow PEP 8 style guide
Use docstrings for all functions, classes, and modules
Write unit tests for new functionality
Maintain 80% or higher test coverage
JavaScript
Follow Airbnb JavaScript Style Guide
Use ES6+ features
Document functions with JSDoc comments
Write unit tests for new components
Commit Guidelines
Use clear, descriptive commit messages
Reference issue numbers in commit messages when applicable
Each commit should represent a logical unit of change
Follow the conventional commits format:
feat: for new features
fix: for bug fixes
docs: for documentation changes
test: for test-related changes
refactor: for code refactoring
style: for formatting changes
chore: for maintenance tasks
Testing
Run existing tests before submitting a PR:
bash

Hide
pytest
cd dashboard && npm test
Add new tests for new functionality
Update tests when changing existing functionality
Documentation
Update README.md with new features or changes in usage
Document new modules, classes, and functions
Update API documentation when changing interfaces
Review Process
At least one core maintainer must review and approve PRs
All CI checks must pass
PRs must address any review comments before merging
Maintainers may request changes or suggest improvements
Security Vulnerabilities
If you discover a security vulnerability, please do NOT open an issue. Email security@sentinel-aegis.com instead.

Release Process
Version numbers follow semantic versioning (MAJOR.MINOR.PATCH)
Release notes are generated from merged PRs
Releases are tagged in the repository
Getting Help
If you need help with contributing:

Join our Discord server
Ask questions in the issue tracker with the "question" label
Email bashcontansa@proton.me
Thank you for contributing to SENTINEL AEGIS!
