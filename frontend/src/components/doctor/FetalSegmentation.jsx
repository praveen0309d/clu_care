import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../services/api";

const FetalSegmentation = () => {
  const [image, setImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [headCircumference, setHeadCircumference] = useState(null);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSegment = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${API_URL}/machine/segment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setHeadCircumference(response.data.head_circumference_mm);
      setMaskImage(response.data.mask_image);
    } catch (err) {
      console.error("Segmentation error:", err);
      alert("Segmentation failed. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fetal Head Segmentation</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSegment} style={{ marginLeft: "10px" }}>
        Segment
      </button>

      {headCircumference !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Head Circumference (mm): {headCircumference}</h3>
        </div>
      )}

      {maskImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Predicted Mask:</h3>
          <img
            src={maskImage}
            alt="Predicted Mask"
            style={{ maxWidth: "600px", border: "1px solid #ccc" }}
          />
        </div>
      )}
    </div>
  );
};

export default FetalSegmentation;
