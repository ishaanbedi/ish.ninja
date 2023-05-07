import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { log } from 'console';
import Head from 'next/head';
interface ProfileData {
    did: string;
    handle: string;
    displayName: string;
    description: string;
    avatar: string;
    banner: string;
    followsCount: number;
    followersCount: number;
    postsCount: number;
    indexedAt: string;
    viewer: {
        muted: boolean;
        blockedBy: boolean;
    };
    labels: string[];
}
function Profile() {
    const [cookies, setCookie] = useCookies(['accessJWT', 'did', 'refreshJWT', 'handle', 'server']);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [newHandle, setNewHandle] = useState<string>('');
    const [haveExistingHandle, setHaveExistingHandle] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const checkExistingHandle = async (handle: string) => {
        console.log(handle)
        try {
            console.log(handle.includes(`${process.env.NEXT_PUBLIC_APP_NAME}`))
            if (handle.includes(`${process.env.NEXT_PUBLIC_APP_NAME}`)) {
                setHaveExistingHandle(true);
                return;
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    const handleUserName = async (handle: string) => {
        setLoading(true);
        const notify = () => toast.loading('Working on it...');
        notify();
        try {
            const { data } = await axios.get(`/api/userNameHandler?username=${handle}&did=${cookies.did}`);
            if (!data.success) {
                toast.dismiss();
                const error = () => toast.error(data.message);
                error();
                setLoading(false);
                return;
            }
            if (data.success) {
                const jwt = cookies.accessJWT
                try {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    await axios.post(`https://${cookies.server}/xrpc/com.atproto.identity.updateHandle`, {
                        handle: `${handle}.${process.env.NEXT_PUBLIC_APP_NAME}`
                    }, {
                        headers: {
                            'authority': cookies.server,
                            'accept': '*/*',
                            'accept-language': 'en-US,en;q=0.9',
                            'authorization': `Bearer ${jwt}`,
                            'content-type': 'application/json'
                        }
                    })
                } catch (error) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    await axios.post(`https://${cookies.server}/xrpc/com.atproto.identity.updateHandle`, {
                        handle: `${handle}.${process.env.NEXT_PUBLIC_APP_NAME}`
                    }, {
                        headers: {
                            'authority': cookies.server,
                            'accept': '*/*',
                            'accept-language': 'en-US,en;q=0.9',
                            'authorization': `Bearer ${jwt}`,
                            'content-type': 'application/json'
                        }
                    })
                }
            }
            toast.dismiss();
            const success = () => toast.success('Done! Handle updated successfully!');
            success();
            setNewHandle('');
            fetchProfile();
        }
        catch (e) {
            console.log(e)
        }
        fetchProfile();
        setLoading(false);
    }
    const fetchProfile = async () => {
        try {
            const { data } = await axios.get<ProfileData>(
                `https://${cookies.server}/xrpc/app.bsky.actor.getProfile?actor=${cookies.did}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookies.accessJWT}`,
                    },
                }
            );
            setProfile(data);
            checkExistingHandle(data.handle);
        } catch (error) {
            router.push('/');
            setCookie('accessJWT', '', { path: '/' });
            setCookie('refreshJWT', '', { path: '/' });
            setCookie('did', '', { path: '/' });
            setCookie('handle', '', { path: '/' });
            setCookie('server', '', { path: '/' });
            console.log(error);
        }
        console.log('ere')
    };

    const router = useRouter();
    useEffect(() => {
        if (!cookies.accessJWT) {
            router.push('/');
        }
    }, [
        cookies.accessJWT,
        cookies.did,
        cookies.refreshJWT,
        cookies.handle,
        cookies.server,
        router
    ]);
    const updateUserName = async () => {
        setLoading(true);
        const notify = () => toast.loading('Updating username...');
        notify();
        try {
            const { data } = await axios.get(`/api/updateUsername?did=${cookies.did}&username=${newHandle}&oldusername=${profile?.handle}`);
            if (!data.success) {
                toast.dismiss();
                const error = () => toast.error(data.message);
                error();
                setLoading(false);

                return;
            }
            if (data.success) {
                const jwt = cookies.accessJWT
                const handle = newHandle
                try {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    await axios.post(`https://${cookies.server}/xrpc/com.atproto.identity.updateHandle`, {
                        handle: `${handle}.${process.env.NEXT_PUBLIC_APP_NAME}`
                    }, {
                        headers: {
                            'authority': cookies.server,
                            'accept': '*/*',
                            'accept-language': 'en-US,en;q=0.9',
                            'authorization': `Bearer ${jwt}`,
                            'content-type': 'application/json'
                        }
                    })
                } catch (error) {
                    const handle = newHandle
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    await axios.post(`https://${cookies.server}/xrpc/com.atproto.identity.updateHandle`, {
                        handle: `${handle}.${process.env.NEXT_PUBLIC_APP_NAME}`
                    }, {
                        headers: {
                            'authority': cookies.server,
                            'accept': '*/*',
                            'accept-language': 'en-US,en;q=0.9',
                            'authorization': `Bearer ${jwt}`,
                            'content-type': 'application/json'
                        }
                    })
                }
            }
            toast.dismiss();
            const success = () => toast.success('Done! Handle updated successfully!');
            success();
            fetchProfile();
        }
        catch (e) {
            toast.dismiss();
            const error = () => toast.error('Something went wrong!');
            error();
            console.log(e)
        }
        fetchProfile();
        setLoading(false);
    }
    const logout = async () => {
        const res = window.confirm('Are you sure you want to logout?');
        if (!res) {
            return;
        }
        setCookie('accessJWT', '', { path: '/' });
        setCookie('refreshJWT', '', { path: '/' });
        setCookie('did', '', { path: '/' });
        setCookie('handle', '', { path: '/' });
        setCookie('server', '', { path: '/' });
        router.push('/');
    }
    useEffect(() => {
        fetchProfile();
    });
    return (
        <>
            <Head>
                <title>Profile | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            </Head>
            {profile && (
                <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <img className="mx-auto h-12 w-auto rounded-full" src={`${profile?.avatar}`} alt="" />
                        <h1 className="text-center text-3xl font-extrabold text-gray-900">
                            {profile?.displayName}
                        </h1>
                        <p className="mt-2 text-center text-sm text-gray-600 max-w">
                            {profile?.description}
                        </p>
                    </div>
                    <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md mx-2">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <h2 className="text-2xl font-extrabold text-gray-900">Profile:</h2>
                            <div className="mt-6">
                                <p className="block text-sm font-medium text-gray-700">
                                    Current Username: {profile?.handle}
                                </p>
                                <p className="block text-sm font-medium text-gray-700">
                                    Display Name: {profile?.displayName}
                                </p>
                                <span onClick={() => {
                                    logout();
                                }} className="cursor-pointer mt-4 block text-sm font-medium text-gray-700 hover:text-gray-500">
                                    Logout
                                </span>
                            </div>
                        </div>
                    </div>
                    {!haveExistingHandle && (<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md mx-2">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <input
                                type="text"
                                name="handle"
                                id="handle"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Enter your desired sub-handle here..."
                                onChange={(e) => {
                                    setNewHandle(e.target.value);
                                }}
                                value={newHandle}
                                maxLength={15}
                                onKeyPress={(e) => {
                                    const pattern = /[a-zA-Z0-9]/;
                                    if (!pattern.test(e.key)) {
                                        e.preventDefault();
                                    }
                                    if (e.key === 'Enter') {
                                        handleUserName(newHandle);
                                    }
                                }}
                                autoComplete="off"
                            />
                            <div className="mt-6">
                                <button
                                    disabled={newHandle.length < 1 || newHandle.length > 15 || loading}
                                    type="submit"
                                    onClick={() => {
                                        handleUserName(newHandle);
                                    }}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${newHandle.length < 1 || newHandle.length > 15 || loading ? 'cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373
                                                    0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042
                                                    1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                    ) : (
                                        'Change Handle'
                                    )
                                    }
                                </button>
                                <p className={`mt-2 text-left text-sm text-gray-600 max-w ${newHandle.length > 0 ? 'block' : 'hidden'}`}>
                                    By clicking the button above, you agree that your sub-handle will be changed immediately (if available).
                                    <br />
                                    Also, for DNS propagation, we will store your did in our database to uniquely identify you. We will not store any other information about you.
                                    <br />
                                    If your current handle is a default handle provided by BlueSky, it&apos;ll be immediately released and anyone on the network can claim it.
                                </p>
                            </div>
                        </div>
                    </div>
                    )
                    }
                    {
                        haveExistingHandle && (
                            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md mx-2">
                                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                    <h2 className="text-md text-gray-900 py-2">
                                        You have already claimed a .{process.env.NEXT_PUBLIC_APP_NAME} handle.
                                        <br />
                                        Update it here:
                                    </h2>
                                    <input
                                        type="text"
                                        name="handle"
                                        id="handle"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                        placeholder="Enter your desired sub-handle here..."
                                        onChange={(e) => {
                                            setNewHandle(e.target.value);
                                        }}
                                        value={newHandle}
                                        maxLength={15}
                                        onKeyPress={(e) => {
                                            const pattern = /[a-zA-Z0-9]/;
                                            if (!pattern.test(e.key)) {
                                                e.preventDefault();
                                            }
                                            if (e.key === 'Enter') {
                                                handleUserName(newHandle);
                                            }
                                        }}
                                        autoComplete="off"

                                    />
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            onClick={() => {
                                                updateUserName();
                                            }}
                                            disabled={newHandle.length < 1 || newHandle.length > 15 || loading}
                                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${newHandle.length < 1 || newHandle.length > 15 || loading ? 'cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin icon icon-tabler icon-tabler-loader-3" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9"></path>
                                                    <path d="M17 12a5 5 0 1 0 -5 5"></path>
                                                </svg>
                                            </> : 'Update'}
                                        </button>
                                        <p className={`mt-2 text-left text-sm text-gray-600 max-w ${newHandle.length > 0 ? 'block' : 'hidden'}`}>
                                            By clicking the button above, you agree that your sub-handle will be changed immediately (if available).
                                            <br />
                                            Your existing handle ({profile?.handle}) will be released and anyone on the network can claim it.
                                            <br />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
            {!profile && (
                <div className="flex justify-center items-center h-screen">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon animate-spin icon-tabler icon-tabler-loader-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 3a9 9 0 1 0 9 9"></path>
                    </svg>
                </div>
            )}
        </>
    );
}

export default Profile;