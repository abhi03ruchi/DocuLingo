document.addEventListener('DOMContentLoaded', () => {
    // Notify background.js that the popup has been opened to clear any previous selected text
    chrome.runtime.sendMessage({ type: 'popupOpened' });

    const supportedLanguages = {
        "afrikaans": "af",
        "albanian": "sq",
        "arabic": "ar",
        "armenian": "hy",
        "azerbaijani": "az",
        "basque": "eu",
        "belarusian": "be",
        "bengali": "bn",
        "bosnian": "bs",
        "bulgarian": "bg",
        "catalan": "ca",
        "cebuano": "ceb",
        "chinese (simplified)": "zh-CN",
        "chinese (traditional)": "zh-TW",
        "croatian": "hr",
        "czech": "cs",
        "danish": "da",
        "dutch": "nl",
        "english": "en",
        "esperanto": "eo",
        "estonian": "et",
        "filipino": "tl",
        "finnish": "fi",
        "french": "fr",
        "galician": "gl",
        "georgian": "ka",
        "german": "de",
        "greek": "el",
        "gujarati": "gu",
        "haitian creole": "ht",
        "hebrew": "iw",
        "hindi": "hi",
        "hmong": "hmn",
        "hungarian": "hu",
        "icelandic": "is",
        "igbo": "ig",
        "indonesian": "id",
        "irish": "ga",
        "italian": "it",
        "japanese": "ja",
        "javanese": "jw",
        "kannada": "kn",
        "kazakh": "kk",
        "khmer": "km",
        "korean": "ko",
        "kurdish (kurmanji)": "ku",
        "kyrgyz": "ky",
        "lao": "lo",
        "latvian": "lv",
        "lithuanian": "lt",
        "luxembourgish": "lb",
        "macedonian": "mk",
        "malagasy": "mg",
        "malay": "ms",
        "malayalam": "ml",
        "maltese": "mt",
        "maori": "mi",
        "marathi": "mr",
        "mongolian": "mn",
        "myanmar (burmese)": "my",
        "nepali": "ne",
        "norwegian": "no",
        "pashto": "ps",
        "persian": "fa",
        "polish": "pl",
        "portuguese": "pt",
        "punjabi": "pa",
        "romanian": "ro",
        "russian": "ru",
        "samoan": "sm",
        "scottish gaelic": "gd",
        "serbian": "sr",
        "sesotho": "st",
        "shona": "sn",
        "sindhi": "sd",
        "sinhala": "si",
        "slovak": "sk",
        "slovenian": "sl",
        "somali": "so",
        "spanish": "es",
        "sundanese": "su",
        "swahili": "sw",
        "swedish": "sv",
        "tajik": "tg",
        "tamil": "ta",
        "telugu": "te",
        "thai": "th",
        "turkish": "tr",
        "ukrainian": "uk",
        "urdu": "ur",
        "uzbek": "uz",
        "vietnamese": "vi",
        "welsh": "cy",
        "xhosa": "xh",
        "yiddish": "yi",
        "yoruba": "yo",
        "zulu": "zu",
    };

    const outputElement = document.getElementById('output');
    const selectedTextContainer = document.getElementById('selectedTextContainer');
    const translatePageToggle = document.getElementById('translatePageToggle');
    const errorMessage = document.getElementById('errorMessage');

    // Function to handle translation based on user selection
    const handleTranslation = (translateWholePage, selectedLanguageCode, selectedText) => {
        if (translateWholePage) {
            chrome.runtime.sendMessage({ action: "translateWholePage", language: selectedLanguageCode }, (response) => {
                if (chrome.runtime.lastError) {
                    document.getElementById('to').innerText = `Error: ${chrome.runtime.lastError.message}`;
                    return;
                }
                document.getElementById('to').innerText = response && response.text ? 'Translation complete.' : 'Translation failed. Try again.';
            });
        } else {
            fetch('http://localhost:8000/translate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: selectedText,
                    target_language: selectedLanguageCode
                }),
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('to').innerText = data.translated_text || 'Translation failed. Try again.';
            })
            .catch(error => {
                console.error('Error with translation request:', error);
                document.getElementById('to').innerText = 'Error occurred. Try again.';
            });
        }
    };

    // Retrieve selected text and set it in the output
    chrome.runtime.sendMessage({ type: 'getText' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
            outputElement.innerText = 'No text selected.';
            return;
        }

        outputElement.innerText = response.text;

        // Toggle display for page translation
        translatePageToggle.addEventListener('change', function () {
            selectedTextContainer.style.display = this.checked ? 'none' : 'block';
            if (this.checked) {
                outputElement.innerText = '';
            }
        });

        // Handle translate button click
        document.getElementById('translateButton').addEventListener('click', () => {
            const languageInput = document.getElementById('languageInput').value.trim().toLowerCase();
            const translateWholePage = translatePageToggle.checked;

            if (supportedLanguages[languageInput]) {
                const selectedLanguageCode = supportedLanguages[languageInput];
                errorMessage.innerText = '';  // Clear any error messages
                const selectedText = outputElement.innerText;

                if (translateWholePage || selectedText) {
                    handleTranslation(translateWholePage, selectedLanguageCode, selectedText);
                } else {
                    errorMessage.innerText = 'No text selected to translate.';
                    errorMessage.style.color = 'red';
                }
            } else {
                errorMessage.innerText = 'Invalid language entered. Please try again.';
                errorMessage.style.color = 'red';
            }
        });
    });
});
