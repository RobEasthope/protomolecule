# NPM Token Setup Guide

This guide explains how to set up the `NPM_TOKEN` required for publishing packages to the NPM registry.

## Why NPM_TOKEN is Needed

The `NPM_TOKEN` is required for:

1. **Automated publishing**: Allows GitHub Actions to publish packages
2. **Authentication**: Proves you have permission to publish to @protomolecule scope
3. **Security**: Avoids using personal login credentials in CI/CD

## Token Types

NPM offers two types of tokens:

### Granular Access Token (Recommended)

**Pros:**

- Fine-grained control over specific packages
- Can limit to specific operations
- Better security through least privilege
- Detailed audit logging

**Cons:**

- More complex setup
- Must specify packages explicitly

### Classic Automation Token

**Pros:**

- Simple setup
- Works for all packages

**Cons:**

- All-or-nothing permissions
- Less secure

## Step-by-Step Setup

### Creating a Granular Access Token (Recommended)

1. **Go to NPM Token Settings**
   - Navigate to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Granular Access Token"

2. **Configure Token Settings**

   **Token Name:**

   ```text
   Protomolecule Release Token
   ```

   **Expiration:**
   - Choose duration (recommend 90 days with reminder)
   - Maximum: 365 days

   **IP Ranges (Optional):**
   - Leave blank for GitHub Actions

3. **⚠️ CRITICAL: Set Packages and Scopes Permissions**

   Select: **"Read and write"**

   Then choose one of:
   - **"All packages"** (simpler)
   - **"Select packages"** and add:
     - `@protomolecule/ui`
     - `@protomolecule/eslint-config`
     - `@protomolecule/colours`

4. **Organizations Permissions**

   Select: **"No access"** (not needed for publishing)

   > **Note**: Organization access is only for managing org settings, NOT for publishing packages

5. **Review Summary**

   ✅ **Correct summary should show:**

   ```text
   This token will:
   - Provide read and write access to 3 packages
   - Provide no access to organizations
   - Expires on [your date]
   ```

   ❌ **Incorrect summary (won't work):**

   ```text
   This token will:
   - Provide no access to packages and scopes  ← WRONG!
   - Provide read and write access to 1 organization
   ```

6. **Generate and Copy Token**
   - Click "Generate Token"
   - **Copy immediately** (starts with `npm_`)
   - Store securely

### Creating a Classic Token (Alternative)

1. Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Classic Token"
3. Select: **"Automation"** (for CI/CD)
4. Copy the token

### Adding Token to GitHub

1. Go to: https://github.com/RobEasthope/protomolecule/settings/secrets/actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Paste your token
5. Click "Add secret"

## Common Mistakes

### ❌ Wrong: No Package Access

```text
Packages and scopes: No access  ← Won't work!
Organizations: Read and write
```

**Result**: `npm ERR! 403 Forbidden - You do not have permission to publish`

### ❌ Wrong: Read-Only Access

```text
Packages and scopes: Read-only  ← Can't publish!
```

**Result**: `npm ERR! 403 Forbidden - You need write access`

### ✅ Correct: Write Access to Packages

```text
Packages and scopes: Read and write  ← Required!
Organizations: No access             ← This is fine
```

## Testing Your Token

### Local Test

```bash
# Set token
export NPM_TOKEN=npm_xxxxxxxxxxxxx

# Create .npmrc
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

# Test authentication
npm whoami
# Should return your username

# Test package access
npm access ls-packages
# Should list your packages

# Clean up
rm ~/.npmrc
```

### Verify Permissions

```bash
# Check if token can publish (dry-run)
cd packages/ui
npm publish --dry-run
# Should show "npm notice Publishing to https://registry.npmjs.org/"
```

## Token Maintenance

### When to Rotate

- Every 90 days (set calendar reminder)
- If token is compromised
- If permissions need change
- Before expiration

### Monitoring Usage

1. Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click on your token
3. View "Last Used" timestamp
4. Check audit log for usage

## Troubleshooting

| Error                  | Cause                        | Solution                                      |
| ---------------------- | ---------------------------- | --------------------------------------------- |
| `403 Forbidden`        | No package write access      | Regenerate with "Read and write" for packages |
| `401 Unauthorized`     | Invalid or expired token     | Generate new token                            |
| `404 Not Found`        | Package doesn't exist        | Ensure package name is correct                |
| `402 Payment Required` | Private package on free plan | Upgrade NPM plan or make package public       |

## Security Best Practices

1. **Never commit tokens** to repository
2. **Use granular tokens** when possible
3. **Set expiration dates** and rotate regularly
4. **Limit scope** to only required packages
5. **Monitor usage** through NPM dashboard
6. **Revoke immediately** if compromised

## Related Documentation

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [NPM Token Documentation](https://docs.npmjs.com/about-access-tokens)
- [RELEASE_PAT Setup](./release-pat-setup.md) - GitHub token setup
- [Release Process](./release-process.md) - How releases work
