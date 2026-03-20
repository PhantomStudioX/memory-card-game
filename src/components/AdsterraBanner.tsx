import { useEffect, useRef } from "react";

export default function AdsterraBanner() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.innerHTML = `
      atOptions = {
        'key' : '95e0b4e0e5d7993263a41b55e968dc4a',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    const script2 = document.createElement("script");
    script2.src = "https://www.highperformanceformat.com/95e0b4e0e5d7993263a41b55e968dc4a/invoke.js";
    script2.async = true;

    if (adRef.current) {
      adRef.current.appendChild(script1);
      adRef.current.appendChild(script2);
    }
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: 300,
        height: 250,
        marginTop: 20,
        alignSelf: "center",
      }}
    />
  );
}