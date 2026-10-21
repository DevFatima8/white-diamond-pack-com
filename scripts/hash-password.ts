/**
 * Generate a bcrypt hash for the admin password.
 *
 *   npx tsx scripts/hash-password.ts
 *
 * It asks for the password (so it doesn't end up in your shell history),
 * then prints a line to paste into .env.
 *
 * Why hash? With ADMIN_PASSWORD_HASH the real password is never stored anywhere;
 * at login we hash what was typed and compare the two hashes with bcrypt.
 */
import bcrypt from 'bcryptjs';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';

const COST = 12; // bcrypt work factor: higher = slower to brute-force (12 ≈ 0.2–0.3 s)
const MIN_LENGTH = 10;

/** Read a line from the terminal without echoing the characters. */
function askHidden(question: string): Promise<string> {
  let muted = false;
  const output = new Writable({
    write(chunk, _encoding, callback) {
      if (!muted) process.stdout.write(chunk);
      callback();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: true });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
    muted = true;
  });
}

async function main() {
  // Optional: pass the password as an argument (handy for scripts, but it stays in shell history).
  const fromArg = process.argv[2];
  const password = fromArg ?? (await askHidden('New admin password: '));

  if (password.length < MIN_LENGTH) {
    console.error(`Password must be at least ${MIN_LENGTH} characters.`);
    process.exit(1);
  }

  if (!fromArg) {
    const again = await askHidden('Repeat password: ');
    if (again !== password) {
      console.error('Passwords do not match.');
      process.exit(1);
    }
  }

  const hash = await bcrypt.hash(password, COST);

  // Next.js expands "$NAME" inside .env values, and bcrypt hashes are full of "$".
  // Unescaped, the value would silently become empty — so we escape each "$" as "\$".
  console.log('\nPaste this line into .env (and remove ADMIN_PASSWORD):\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, '\\$')}`);
  console.log('\nIn a hosting panel (e.g. Hostinger env variables) use the raw value instead:\n');
  console.log(hash);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
