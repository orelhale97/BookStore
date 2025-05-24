import "./DetailsGroup.scss";
import { useEffect, useState, useRef } from "react";
import {
  fetchAuthors,
  fetchPublishers,
  updateBook,
  uploadBookImage,
} from "../../services/admin.service";

export default function DetailsGroup({ object, isAdmin, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    authorId: "",
    publisherId: "",
    src: "",
  });
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (object) {
      console.log("Initializing form data with object:", object);
      setFormData({
        name: object.name || "",
        authorId: object.author?.id || "",
        publisherId: object.publisher?.id || "",
        src: object.src || "",
      });
    }
  }, [object]);

  useEffect(() => {
    if (isAdmin) {
      console.log("Fetching authors and publishers");
      fetchAuthors().then(setAuthors);
      fetchPublishers().then(setPublishers);
    }
  }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Form field changed:", name, value);
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "authorId" || name === "publisherId" ? Number(value) : value,
    }));
  };

  const handleImageClick = () => {
    if (isAdmin && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Image selected:", file);
      setSelectedFile(file);
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        src: previewUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imagePath = formData.src;

      // If there's a new image selected, upload it first
      if (selectedFile) {
        const uploadResponse = await uploadBookImage(selectedFile);
        console.log("uploadResponse ==== ", uploadResponse);

        imagePath = uploadResponse.imagePath.replace("assets/", "");
      }

      // Update book data with the new image path
      const updatedBook = {
        ...formData,
        src: imagePath,
        authorId: Number(formData.authorId),
        publisherId: Number(formData.publisherId),
      };

      await updateBook(object.id, updatedBook);
      console.log("Update successful, calling onUpdate");
      if (onUpdate) onUpdate(updatedBook);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="DetailsGroup">
        <div
          className="img-wrap"
          onClick={handleImageClick}
          style={{ cursor: isAdmin ? "pointer" : "default" }}
        >
          <img src={formData.src} alt={formData.name} />
          {isAdmin && (
            <div className="image-upload-overlay">
              <span>Click to change image</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <form className="Detalies" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Book Name"
          />
          <select
            name="authorId"
            value={formData.authorId}
            onChange={handleInputChange}
          >
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          <select
            name="publisherId"
            value={formData.publisherId}
            onChange={handleInputChange}
          >
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
          <div className="edit-actions">
            <button type="submit" disabled={isUploading}>
              {isUploading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => onUpdate && onUpdate()}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="DetailsGroup">
      <div className="img-wrap">
        <img src={object?.src} alt={object?.name} />
      </div>
      <div className="Detalies">
        <span className="data">{object?.name || ""}</span>
        <span className="data">{object?.author?.name || ""}</span>
        <span className="data">{object?.publisher?.name || ""}</span>
      </div>
    </div>
  );
}
