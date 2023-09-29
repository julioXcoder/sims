import { JWTPayload, jwtVerify, SignJWT } from "jose";

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");
  }

  return secret;
};

const alg = "HS256";

// async function verifyToken(token: string) {
//   try {
//     const decoded = await jwtVerify(token, getJwtSecretKey());
//     return decoded.payload;
//   } catch (err) {
//     throw err;
//   }
// }

// async function createToken(payload: JWTPayload) {
//   try {
//     const token = await new SignJWT({ "urn:example:claim": true })
//       .setProtectedHeader({ alg })
//       .setIssuedAt()
//       .setIssuer("urn:example:issuer")
//       .setAudience("urn:example:audience")
//       .setExpirationTime("24h")
//       .sign(new TextEncoder().encode(getJwtSecretKey()));
//     return token;
//   } catch (err) {
//     throw err;
//   }
// }

async function createToken(payload: JWTPayload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(getJwtSecretKey()));
    return token;
  } catch (err) {
    throw err;
  }
}

const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey()),
    );
    return verified.payload as { id: number };
  } catch (ex) {
    throw new Error("Error occurred while trying to verifying the token.");
  }
};

export { createToken, verifyAuth };
