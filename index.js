import galleryItems from "./gallery-items.js";

const refs = {
  gallery: document.querySelector(".js-gallery"),
  lightBox: document.querySelector(".js-lightbox"),
  closeBtn: document.querySelector("[data-action='close-lightbox']"),
  originalImage: document.querySelector(".js-lightbox img"),
  overlay: document.querySelector(".lightbox__overlay"),
};

const galleryItemsMarkup = makeGalleryItemsMarkup(galleryItems);
refs.gallery.insertAdjacentHTML("afterbegin", galleryItemsMarkup);

refs.gallery.addEventListener("click", onGalleryItemClick);
refs.closeBtn.addEventListener("click", onCloseBtnClick);
refs.overlay.addEventListener("click", onOverlayClick);

function makeGalleryItemsMarkup(items) {
  return items
    .map((item) => {
      const { preview, original, description } = item;
      const liItem = `<li class="gallery__item"><a class="gallery__link" href="${original}">
      <img class="gallery__image" src="${preview}" data-source="${original}" alt="${description}"/></a></li>`;
      return liItem;
    })
    .join("");
}

function onGalleryItemClick(e) {
  e.preventDefault();

  window.addEventListener("keydown", onEcsKeyClick);
  window.addEventListener("keydown", onLeftArrowKeyClick);
  window.addEventListener("keydown", onRightArrowKeyClick);

  if (e.target.nodeName === "IMG") {
    refs.lightBox.classList.add("is-open");
    const originalImageUrl = e.target.dataset.source;
    refs.originalImage.src = originalImageUrl;
    refs.originalImage.alt = e.target.alt;
  }
}

function onCloseBtnClick(e) {
  window.removeEventListener("keydown", onEcsKeyClick);
  window.removeEventListener("keydown", onLeftArrowKeyClick);
  window.removeEventListener("keydown", onRightArrowKeyClick);

  refs.originalImage.src = "";
  refs.originalImage.alt = "";
  refs.lightBox.classList.remove("is-open");
}

function onOverlayClick(e) {
  if (e.currentTarget === e.target) {
    onCloseBtnClick();
  }
}

function onEcsKeyClick(e) {
  const ESC_KEY_CODE = "Escape";
  const isEscape = e.code === ESC_KEY_CODE;
  if (isEscape) {
    onCloseBtnClick();
  }
}

function onLeftArrowKeyClick(e) {
  const LEFT_ARROW_KEY_CODE = "ArrowLeft";
  const isArrowLeft = e.code === LEFT_ARROW_KEY_CODE;
  if (isArrowLeft) {
    const currentIndex = findCurrentIndexOfImg();
    const nextIndex = findNextIndexToTheLeft(currentIndex);
    const { original, description } = galleryItems[nextIndex];
    refs.originalImage.src = original;
    refs.originalImage.alt = description;
  }
}

function onRightArrowKeyClick(e) {
  const RIGHT_ARROW_KEY_CODE = "ArrowRight";
  const isArrowRight = e.code === RIGHT_ARROW_KEY_CODE;
  if (isArrowRight) {
    const currentIndex = findCurrentIndexOfImg();
    const nextIndex = findNextIndexToTheRight(currentIndex);
    const { original, description } = galleryItems[nextIndex];
    refs.originalImage.src = original;
    refs.originalImage.alt = description;
  }
}

function findCurrentIndexOfImg() {
  const currentImageUrl = refs.originalImage.src;
  const currentImage = galleryItems.find(
    ({ original }) => original === currentImageUrl
  );
  const currentIndex = galleryItems.indexOf(currentImage);
  return currentIndex;
}

function findNextIndexToTheRight(index) {
  let nextIndex;
  if (index === galleryItems.length - 1) {
    nextIndex = 0;
  } else {
    nextIndex = index + 1;
  }
  return nextIndex;
}

function findNextIndexToTheLeft(index) {
  let nextIndex;
  if (index === 0) {
    nextIndex = galleryItems.length - 1;
  } else {
    nextIndex = index - 1;
  }
  return nextIndex;
}
