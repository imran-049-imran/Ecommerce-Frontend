import React, { useState } from "react";

const ImgWithFallback = ({ src, alt, className, fallback = "/no-image.png" }) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
};

export default ImgWithFallback;
