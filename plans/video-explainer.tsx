"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Loader2, X } from "lucide-react";
import Hls from "hls.js";

export const VideoExplainer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hlsSupported, setHlsSupported] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const clipPath = useTransform(
        scrollYProgress, 
        [0, 0.2, 0.8, 1], 
        [
            "inset(15vh 10vw 15vh 10vw round 24px)", 
            "inset(0vh 0vw 0vh 0vw round 0px)", 
            "inset(0vh 0vw 0vh 0vw round 0px)", 
            "inset(15vh 10vw 15vh 10vw round 24px)"
        ]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 1, 1, 0.3]);
    const closeOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.8, 0.85], [0, 1, 1, 0]);

    // Setup HLS.js and default video settings
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set default playback speed to 1.2x
        video.playbackRate = 1.2;
        video.defaultPlaybackRate = 1.2;

        let hls: Hls | null = null;
        const videoSrc = "/videos/hls/explainer.m3u8";

        if (Hls.isSupported()) {
            hls = new Hls({
                autoStartLoad: true,
                startPosition: -1,
                capLevelToPlayerSize: true,
            });
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setHlsSupported(true);
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error("HLS fatal error:", data);
                    setHlsSupported(false);
                    setIsLoading(false); // Stop loading if error
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari supports HLS natively
            video.src = videoSrc;
        } else {
            // Fallback for browsers that don't support HLS or Native Apple HLS (rare)
            setHlsSupported(false);
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, []);

    // Handle intersection for play/pause
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        video.play().catch(e => {
                            console.log("Autoplay prevented", e);
                            setIsPlaying(false);
                        });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 } // Play when at least 50% is visible
        );

        observer.observe(video);
        return () => observer.unobserve(video);
    }, []);

    // Keyboard controls for seeking
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const video = videoRef.current;
            if (!video) return;

            if (video.paused) return;

            if (e.key === "ArrowRight") {
                e.preventDefault();
                video.currentTime = Math.min(video.currentTime + 5, video.duration);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                video.currentTime = Math.max(video.currentTime - 5, 0);
            } else if (e.key === " ") {
                e.preventDefault();
                togglePlay();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(() => setIsPlaying(false));
        } else {
            video.pause();
        }
    };

    const handleExit = () => {
        if (containerRef.current) {
            const y = containerRef.current.offsetTop + containerRef.current.offsetHeight;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <section ref={containerRef} className="w-full relative h-[300vh] bg-black">
            <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
                <motion.div 
                    style={{ clipPath, opacity }} 
                    className="absolute inset-0 w-full h-full bg-black/10 group"
                >
                    <video
                        ref={videoRef}
                        // Fallback to original mp4 if HLS fails entirely
                        src={!hlsSupported ? "/videos/Arture%20Industrial%20Explainer.mp4" : undefined}
                        className="absolute inset-0 w-full h-full object-cover"
                        loop
                        playsInline
                        onWaiting={() => setIsLoading(true)}
                        onCanPlay={() => setIsLoading(false)}
                        onPlaying={() => {
                            setIsPlaying(true);
                            setIsLoading(false);
                        }}
                        onPause={() => setIsPlaying(false)}
                        onClick={togglePlay}
                    />

                    {/* Big Play Button Overlay (Visible when paused and not loading) */}
                    <div 
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 pointer-events-none ${(!isPlaying && !isLoading) ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <button 
                            onClick={togglePlay}
                            className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors pointer-events-auto shadow-2xl"
                        >
                            <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-2" fill="currentColor" />
                        </button>
                    </div>

                    {/* Loading Indicator Overlay */}
                    <div 
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 pointer-events-none ${isLoading ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Loader2 className="w-12 h-12 text-white animate-spin drop-shadow-lg" />
                    </div>
                </motion.div>

                {/* Exit Fullscreen Button */}
                <motion.button
                    style={{ opacity: closeOpacity }}
                    onClick={handleExit}
                    className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors shadow-2xl z-50 pointer-events-auto"
                    aria-label="Exit video"
                >
                    <X className="w-6 h-6 text-white" />
                </motion.button>
            </div>
        </section>
    );
};
