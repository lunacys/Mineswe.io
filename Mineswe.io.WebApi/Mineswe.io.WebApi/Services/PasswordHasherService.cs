﻿using System;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using Microsoft.Extensions.Options;

namespace Mineswe.io.WebApi.Services
{
    public sealed class PasswordHasherService : IPasswordHasherService
    {
        private const int SaltSize = 16;
        private const int KeySize = 32;

        private HashingOptions _options;

        public PasswordHasherService(IOptions<HashingOptions> options)
        {
            _options = options.Value;
        }

        public string Hash(string password)
        {
            using var algo = new Rfc2898DeriveBytes(password, SaltSize, _options.Iterations, HashAlgorithmName.SHA512);

            var key = Convert.ToBase64String(algo.GetBytes(KeySize));
            var salt = Convert.ToBase64String(algo.Salt);

            return salt + key + _options.Iterations;
        }

        public (bool Verified, bool NeedsUpgrade) Check(string hash, string password)
        {
            var parts = new string[3];

            var saltSize = GetOutputBase64Size(SaltSize);
            var keySize = GetOutputBase64Size(KeySize);

            parts[0] = hash.Substring(0, saltSize);
            parts[1] = hash.Substring(saltSize, keySize);
            parts[2] = hash.Substring(saltSize + keySize);

            var salt = Convert.FromBase64String(parts[0]);
            var key = Convert.FromBase64String(parts[1]);
            var iterations = Convert.ToInt32(parts[2]);

            var needsUpgrade = iterations != _options.Iterations;

            using var algo = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA512);

            var keyToCheck = algo.GetBytes(KeySize);
            var verified = keyToCheck.SequenceEqual(key);

            return (verified, needsUpgrade);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private int GetOutputBase64Size(int baseSize)
        {
            return ((4 * baseSize / 3) + 3) & ~3;
        }
    }
}