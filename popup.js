document.addEventListener('DOMContentLoaded', function () {
    // List of supported languages (language names and codes)
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
    

    // Send a message to get the selected text
    chrome.runtime.sendMessage({ type: 'getText' }, function (response) {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
            document.getElementById('output').innerText = 'No text selected.';
            return;
        }

        const outputElement = document.getElementById('output');
        const selectedTextContainer = document.getElementById('selectedTextContainer');
        const translatePageToggle = document.getElementById('translatePageToggle');
        const errorMessage = document.getElementById('errorMessage');

        outputElement.innerText = response.text;

        translatePageToggle.addEventListener('change', function () {
            if (this.checked) {
                selectedTextContainer.style.display = 'none';
                outputElement.innerText = '';
            } else {
                selectedTextContainer.style.display = 'block';
            }
        });

        document.getElementById('translateButton').addEventListener('click', function () {
            const languageInput = document.getElementById('languageInput').value.trim().toLowerCase();
            const translateWholePage = translatePageToggle.checked;

            // Check if the entered language is valid
            if (supportedLanguages[languageInput]) {
                const selectedLanguageCode = supportedLanguages[languageInput];
                errorMessage.innerText = '';  // Clear error message

                if (translateWholePage) {
                    console.log('Translating whole page to:', selectedLanguageCode);
                    // Add logic to translate the whole page here
                } else {
                    console.log('Translating selected text to:', selectedLanguageCode);
                    // Add logic to translate selected text here
                }

                document.getElementById('to').innerText = 'Translation in progress...';
            } else {
                // Display an error message if the language is invalid
                errorMessage.innerText = 'Invalid language entered. Please try again.';
                errorMessage.style.color = 'red';
            }
        });
    });
});
