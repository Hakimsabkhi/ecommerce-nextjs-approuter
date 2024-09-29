import { NextAuthOptions, Session, User as NextAuthUser, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import connectToDatabase from '@/lib/db';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User';

declare module 'next-auth' {
  // Extend the DefaultSession interface
  interface Session {
    UserModel: DefaultSession['user'] & {
      id: string;
      role:  'Visiteur' | 'Consulter' | 'Admin' | 'SuperAdmin';
    };
  }

  // Extend the User interface
  interface User {
    id: string;
    role: 'Visiteur' | 'Consulter' | 'Admin' | 'SuperAdmin';
  }
}

type UserType = {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role:  'Visiteur' | 'Consulter' | 'Admin' | 'SuperAdmin';
  save: () => Promise<UserType>;
};

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const googleClientId: string = getEnvVar('GOOGLE_CLIENT_ID');
const googleClientSecret: string = getEnvVar('GOOGLE_CLIENT_SECRET');
const nextAuthSecret: string = getEnvVar('NEXTAUTH_SECRET');

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          await connectToDatabase();
          const user = await UserModel.findOne({ email: credentials.email }) as UserType | null;
          
          if (user && bcrypt.compareSync(credentials.password, user.password || '')) {
            
            return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: undefined,
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as 'Visiteur' | 'Consulter' | 'Admin'| 'SuperAdmin',
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        const users=await UserModel.findOne({ email: user.email as string })
        
        token.id = user.id;
        token.role = users?.role;
      }
      return token;
    },
    async signIn({ user }: { user: NextAuthUser }) {
      try {
        await connectToDatabase();
        const existingUser = await UserModel.findOne({ email: user.email as string }) as UserType | null;
        if (!existingUser) {
          const newUser = new UserModel({
            username: user.name!,
            role: user.role,
            email: user.email as string,
            password: undefined,
          }) as UserType;
          await newUser.save();
        } /* else {
          existingUser.username = user.name!;
          existingUser.role = user.role;
          await existingUser.save();
        } */
        return true;
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false;
      }
    },
    async redirect({ baseUrl }: { baseUrl: string }) {
      return baseUrl;
    },
  },
  secret: nextAuthSecret,
};
