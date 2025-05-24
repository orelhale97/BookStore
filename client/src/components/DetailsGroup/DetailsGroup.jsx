import "./DetailsGroup.scss";
import { useEffect, useState, useRef } from "react";
import {
  createBook,
  fetchAuthors,
  fetchPublishers,
  updateBook,
  uploadBookImage,
} from "../../services/admin.service";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function DetailsGroup({ object, isAdmin, onUpdate, mode = "edit", }) {
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
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (object) {
      console.log("Initializing form data with object:", object);
      setFormData({
        name: object?.name || "",
        authorId: object?.author?.id || "",
        publisherId: object?.publisher?.id || "",
        src: object?.src || "",
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Book name is required";
    }
    if (!formData.authorId) {
      newErrors.authorId = "Please select an author";
    }
    if (!formData.publisherId) {
      newErrors.publisherId = "Please select a publisher";
    }
    if (!formData.src && !selectedFile) {
      newErrors.image = "Please upload a book image";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Form field changed:", name, value);
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "authorId" || name === "publisherId" ? Number(value) : value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
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
      setFormData((prev) => ({ ...prev, src: previewUrl }));

      // Clear image error if it exists
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    try {
      let imagePath = formData.src;

      // If there's a new image selected, upload it first
      if (selectedFile) {
        const uploadResponse = await uploadBookImage(selectedFile);
        console.log("uploadResponse ==== ", uploadResponse);

        imagePath = uploadResponse.imagePath.replace("assets/", "");
      }

      // Prepare book data
      const bookData = {
        ...formData,
        src: imagePath,
        authorId: Number(formData.authorId),
        publisherId: Number(formData.publisherId),
      };

      let result;
      if (object.id) {
        result = await updateBook(object.id, bookData);
      } else {
        result = await createBook(bookData);
      }

      console.log(`${mode === "edit" ? "Update" : "Create"} successful, calling onUpdate`);

      if (onUpdate) onUpdate(result);
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} book:`, error);
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
          {formData.src ? (<img src={formData.src} alt={formData.name} />) : (
            <div className="no-image">
              <AddPhotoAlternateIcon style={{ fontSize: 48 }} />
              <span>Click to upload image</span>
            </div>
          )}
          {isAdmin && (
            <div className="image-upload-overlay">
              <span>Click to {formData.src ? "change" : "upload"} image</span>
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
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Book Name"
              className={errors.name ? "error" : ""}
            />

            {errors.name && (<span className="error-message">{errors.name}</span>)}
          </div>

          <div className="form-group">
            <select
              name="authorId"
              value={formData.authorId}
              onChange={handleInputChange}
              className={errors.authorId ? "error" : ""}
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>

            {errors.authorId && (<span className="error-message">{errors.authorId}</span>)}
          </div>

          <div className="form-group">
            <select
              name="publisherId"
              value={formData.publisherId}
              onChange={handleInputChange}
              className={errors.publisherId ? "error" : ""}
            >
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </select>
            {errors.publisherId && (<span className="error-message">{errors.publisherId}</span>)}
          </div>

          {errors.image && (<span className="error-message">{errors.image}</span>)}

          <div className="edit-actions">
            <button type="submit" disabled={isUploading}>
              {isUploading ? "Saving..." : mode === "edit" ? "Save" : "Create"}
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
