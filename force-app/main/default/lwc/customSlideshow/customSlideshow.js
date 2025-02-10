import { LightningElement, track } from 'lwc';
import DOCUMENTS_ZIP from '@salesforce/resourceUrl/Documents'; //Import the ZIP file static Resource

// NOTE: Documents ZIP File Structure:
// 1. Create a folder called 'Documents'.
// 2. Inside 'Documents', create another folder called 'images' and put your image files there.
// 3. Zip the 'Documents' folder (make sure the file size is under 5 MB).
// 4. Upload the ZIP file to Salesforce as a static resource and name it 'Documents'.

//Custom Label to store of image file names to be used in the slideshow. Example: Image1.jpg,Image2.jpg,Image3.png,Image4.jpg
import IMAGES_NAMES from '@salesforce/label/c.Images_Names';


export default class CustomSlideshow extends LightningElement {
    @track currentIndex = 0;
    @track stopSlideShow = false;
    @track slideInterval;
    @track slides = [];

    //Initializes the slides array by mapping over the IMAGES_NAMES array.
    initializeSlides() {
        const fileNamesArray = IMAGES_NAMES.split(',');
        this.slides = fileNamesArray.map((fileName, index) => ({
            Id: index,
            url: `${DOCUMENTS_ZIP}/Documents/images/${fileName}`,
            altText: `Slide ${index + 1}`,
            isActive: index === 0
        }));
        this.checkImagesLoaded(); //Check if all images are loaded from static resource or not
    }

    connectedCallback() {
        this.initializeSlides();
    }

    //Checks if all images in the slides array are loaded. If all images are loaded, it starts the slideshow.
    checkImagesLoaded() {
        const promises = this.slides.map(slide => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = slide.url;
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
            });
        });

        Promise.all(promises).then(results => {
            this.isLoaded = results.every(result => result);
            if (this.isLoaded) {
                //Start the slideshow interval if all images are loaded
                this.slideInterval = setInterval(() => {
                    if (!this.stopSlideShow) {
                        this.nextSlide();
                        if (this.currentIndex >= this.slides.length - 1) {
                            clearInterval(this.slideInterval);
                            this.stopSlideShow = true;
                        }
                    }
                }, 3000);
            } else {
                console.error('Some images failed to load.');
            }
        });
    }

    //Method to handle NEXT or PREVIOUS slides navigation 
    handleNavigation(event) {
        var buttonType = event.target.dataset.type;
        if (buttonType == 'next')
            this.nextSlide();
        else if (buttonType == 'previous')
            this.previousSlide();

        this.stopSlideShow = true;
    }

    //To move to the next slide
    nextSlide() {
        var nextIndex = Number(this.currentIndex) + 1;
        if (nextIndex < this.slides.length) {
            this.slides[this.currentIndex].isActive = false;
            this.currentIndex = nextIndex;
            this.slides[nextIndex].isActive = true;
            this.handleNavigationDots(this.currentIndex);
        }
    }

    //To move to the previous slide
    previousSlide() {
        var previousIndex = Number(this.currentIndex) - 1;
        if (previousIndex >= 0) {
            this.slides[this.currentIndex].isActive = false;
            this.currentIndex = previousIndex;
            this.slides[previousIndex].isActive = true;
            this.handleNavigationDots(this.currentIndex);
        }
    }

    //To stop the slide show
    stopSlideshow() {
        this.stopSlideShow = true;
        clearInterval(this.slideInterval);
    }

    disconnectedCallback() {
        clearInterval(this.slideInterval);
    }

    //Method to show the slide image for the selected navigation dot
    handleDotClick(event) {
        const clickedIndex = event.target.dataset.index;
        if (clickedIndex !== this.currentIndex) {
            this.slides[this.currentIndex].isActive = false;
            this.slides[clickedIndex].isActive = true;
            this.currentIndex = clickedIndex;

            this.stopSlideshow();
            this.handleNavigationDots(clickedIndex);
        }
    }

    //Method to add/remove css from selected navigation dot
    handleNavigationDots(currentIndex) {
        const allDots = this.template.querySelectorAll('.navigation-dots span');
        allDots.forEach(dot => dot.classList.remove('active'));
        const activeDot = this.template.querySelector(`[data-index="${currentIndex}"]`);
        activeDot.classList.add('active');
    }


}