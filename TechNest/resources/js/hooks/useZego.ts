import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { ZegoConfig, ZegoUser } from '@/types/live'
import { useEffect, useState } from 'react'

export function useZego(config: ZegoConfig) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initZego = async () => {
            try {
                console.log('Starting Zego initialization...');
                
                // Kiểm tra config
                if (!config.appID || !config.serverSecret) {
                    throw new Error('Missing Zego configuration');
                }

                // Đảm bảo appID là number
                const appID = typeof config.appID === 'string' ? parseInt(config.appID) : config.appID;
                if (isNaN(appID)) {
                    throw new Error('Invalid appID format');
                }

                console.log('Zego config:', {
                    appID: appID,
                    appIDType: typeof appID,
                    hasServerSecret: !!config.serverSecret
                });

                setIsInitialized(true);
                console.log('Zego initialized successfully');
                
            } catch (err) {
                console.error('Error initializing Zego:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize Zego');
            }
        };

        initZego();
    }, [config.appID, config.serverSecret]);

    const generateToken = (roomID: string, userID: string) => {
        try {
            // Đảm bảo appID là number
            const appID = typeof config.appID === 'string' ? parseInt(config.appID) : config.appID;
            
            console.log('Generating token with config:', {
                appID: appID,
                appIDType: typeof appID,
                serverSecret: config.serverSecret ? 'exists' : 'missing',
                roomID,
                userID
            });

            if (isNaN(appID)) {
                throw new Error('Invalid appID: must be a number');
            }

            const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                config.serverSecret,
                roomID,
                userID,
                userID
            );
            
            console.log('Token generated successfully');
            return token;
        } catch (err) {
            console.error('Error generating token:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate token');
            return null;
        }
    };

    const createLiveStream = (element: HTMLElement, roomID: string, user: ZegoUser, isHost: boolean = false) => {
        console.log('createLiveStream called with:', { roomID, user, isHost, initialized: isInitialized });
        
        if (!isInitialized) {
            const errorMsg = 'Zego not initialized';
            console.error(errorMsg);
            setError(errorMsg);
            throw new Error(errorMsg);
        }

        const token = generateToken(roomID, user.userID);
        if (!token) {
            const errorMsg = 'Failed to generate token';
            console.error(errorMsg);
            setError(errorMsg);
            throw new Error(errorMsg);
        }

        console.log('Creating Zego instance...');
        const zc = ZegoUIKitPrebuilt.create(token);
        
        const zegoConfig: any = {
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                    role: isHost ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Audience,
                },
            },
        };

        if (isHost) {
            zegoConfig.sharedLinks = [{
                name: 'Copy link',
                url: window.location.origin + '/live/' + roomID.replace('room_', ''),
            }];
        }

        console.log('Joining room with config:', zegoConfig);
        zc.joinRoom(zegoConfig);

        return zc;
    };

    return {
        ZegoUIKitPrebuilt,
        isInitialized,
        error,
        generateToken,
        createLiveStream,
    };
}
