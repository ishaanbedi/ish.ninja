
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import Head from 'next/head';

interface CreateSessionResponse {
  accessJwt?: string;
  did?: string;
  refreshJwt?: string;
  handle?: string;
}

const Home: React.FC = () => {
  const [server, setServer] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['accessJWT', 'did', 'refreshJWT', 'handle', 'server']);

  const handleServerChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setServer(event.target.value);
  }, []);

  const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.get(`https://${server}/xrpc/com.atproto.server.describeServer`);
      const { data } = await axios.post<CreateSessionResponse>(`https://${server}/xrpc/com.atproto.server.createSession`, {
        "identifier": email,
        "password": password
      });
      const accessJWT = data?.accessJwt;
      const did = data?.did;
      const refreshJWT = data?.refreshJwt;
      const handle = data?.handle;

      setCookie('accessJWT', accessJWT);
      setCookie('did', did);
      setCookie('refreshJWT', refreshJWT);
      setCookie('handle', handle);
      setCookie('server', server);

      console.log(data);

      router.push('/profile');

    } catch (error) {
      alert("Please recheck the server name and your credentials.");
    }
    setLoading(false);
  }, [server, email, password, router, setCookie]);

  useEffect(() => {
    if (cookies?.accessJWT) {
      router.push('/profile');
    }
  }, [cookies, router]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta property="og:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
        <meta property="og:description" content="Free .ish.ninja sub-handle for your BlueSky account!" />
        <meta property="og:image" content="https://ish.ninja/og.jpg" />
        <meta property="og:url" content="https://ish.ninja" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ishnbedi" />
        <meta name="twitter:creator" content="@ishnbeid" />
        <meta name="twitter:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
        <meta name="twitter:description" content="Free .ish.ninja sub-handle for your BlueSky account!" />
        <meta name="twitter:image" content="https://ish.ninja/og.jpg" />

        <meta name="description" content="Free .ish.ninja sub-handle for your BlueSky account!" />
        <meta name="keywords" content="bluesky, handle, sub-handle, blueskyhandle, bluesky handle" />
        <meta name="author" content="Ishaan Bedi" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-teal-600 sm:text-3xl">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>

          <p className="mx-auto mt-4 mb-1 lg:md:sm:text-md text-sm max-w-lg text-center text-gray-500">
            Free .{process.env.NEXT_PUBLIC_APP_NAME} sub-handle for your Bluesky account!
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Login with your Bluesky credentials:
            </h2>
            <div className='mt-6'>
              <label htmlFor="server" className="block text-sm font-medium text-gray-700">
                Server
              </label>
              <div className="mt-1">
                <input
                  id="server"
                  name="server"
                  type="text"
                  required
                  value={server}
                  onChange={handleServerChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="bsky.social"
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="hello@example.com"
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="********"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                disabled={loading}
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Login
              </button>
            </div>
            <p className="mt-6 text-xs text-center text-gray-500">
              Your login credentials are used to verify your identity directly with BlueSky.
            </p>
            <p className="lg:md:sm:block hidden text-xs text-center text-gray-500">
              All the tokens and profile data will never be stored on our database.
            </p>
            <p className="mt-6 text-xs text-center text-gray-500">
              By <Link href="https://staging.bsky.app/profile/ishaanbedi.in" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-500">@ishaanbedi.in</Link> | {" "}
              <Link href="https://ishaanbedi.in" target="_blank" rel="noopener noreferrer" className="mt-6 text-xs text-center text-teal-600 hover:text-teal-500">
                ishaanbedi.in
              </Link>
            </p>
          </form>

        </div>
      </div>
    </main>
  );
};

export default Home;
