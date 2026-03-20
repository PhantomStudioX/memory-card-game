import { useEffect, useRef } from "react";

export default function AdsterraBanner() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Clear previous content (prevents duplicates)
    adRef.current.innerHTML = "";

    // Inject first script
    const script1 = document.createElement("script");
    script1.innerHTML = `
      atOptions = {
        'key' : '46c3b4c4458f14c2a16b0777e246c214',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    // Inject second script
    const script2 = document.createElement("script");
    script2.src =
      "https://www.highperformanceformat.com/46c3b4c4458f14c2a16b0777e246c214/invoke.js";
    script2.async = true;

    adRef.current.appendChild(script1);
    adRef.current.appendChild(script2);
  }, []);

  return (
    <div
      ref={adRef}
      style={{
        width: 320,
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // prevents strange stretching
      }}
    />
  );
}