class HashtagValidationService {
  constructor(buefyToast) {
    this.buefyToast = buefyToast;
  }

  dangerToast(message) {
    this.buefyToast.open({
      duration: 5000,
      message,
      position: "is-top",
      type: "is-danger",
    });
  }

  /**
   * Validate a hashtag.
   *
   * This is a general purpose function that will validate that a new hashtag string
   * has the correct format.
   *
   * Additionally it validates whether the hashtag is new and throws an error if
   * the hashtag being validated already exists.
   *
   * @TODO move the existing hashtag check into its own function.
   *
   * @param {string || object} hashtag string or hashtag object.
   * @param { object } hashtags json object containing first 1000 minted hashtags
   * @returns { boolean} true for valid, false for invalid. And a toast notification.
   */
  validateTag(hashtag, hashtags) {
    const inputValue =
      hashtag && hashtag.hashtagWithoutHash
        ? hashtag.hashtagWithoutHash
        : hashtag;
    const machineName = inputValue.toLowerCase();
    // console.log("input inputValue", inputValue);2
    // console.log("machineName", machineName);
    // console.log(hashtags);
    if (
      (hashtags || []).filter((option) => {
        return option.hashtagWithoutHash === machineName;
      }).length !== 0
    ) {
      this.dangerToast(
        `Sorry, but '#${inputValue}' already exists. Please try another.`
      );
      return false;
    }

    if (inputValue.includes("#")) {
      this.dangerToast(
        `The hashtag character ("#") is not permitted anywhere in your hashtag.`
      );
      return false;
    }

    if (inputValue.length < 3) {
      this.dangerToast(
        `Sorry, but '#${inputValue}' is an invalid tag as it's less than 3 characters long.`
      );
      return false;
    }

    if (inputValue.length > 32) {
      this.dangerToast(
        `Sorry, but '#${inputValue}' is an invalid tag as it's more than 15 characters long.`
      );
      return false;
    }

    if (!/^#*\d*[a-zA-Z][a-zA-Z0-9]*$/.test(inputValue)) {
      this.dangerToast(
        `Sorry, but '#${inputValue}' is an invalid tag as it's either not alpha numeric or only numeric.`
      );
      return false;
    }

    return true;
  }
}

export default HashtagValidationService;
