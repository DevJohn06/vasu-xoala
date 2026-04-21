import json
import re

content = ""
with open('src/data/countries.ts', 'r') as f:
    content = f.read()

matches = re.finditer(r'name: \"([^\"]+)\", flag: \"([^\"]+)\"', content)

# A reasonable list of known currencies mapping
curr_map = {
  "Afghanistan": "AFN", "Albania": "ALL", "Algeria": "DZD", "Andorra": "EUR", "Angola": "AOA",
  "Antigua and Barbuda": "XCD", "Argentina": "ARS", "Armenia": "AMD", "Australia": "AUD",
  "Austria": "EUR", "Azerbaijan": "AZN", "Bahamas": "BSD", "Bahrain": "BHD", "Bangladesh": "BDT",
  "Barbados": "BBD", "Belarus": "BYN", "Belgium": "EUR", "Belize": "BZD", "Benin": "XOF",
  "Bhutan": "BTN", "Bolivia": "BOB", "Bosnia and Herzegovina": "BAM", "Botswana": "BWP",
  "Brazil": "BRL", "Brunei": "BND", "Bulgaria": "BGN", "Burkina Faso": "XOF", "Burundi": "BIF",
  "Cambodia": "KHR", "Cameroon": "XAF", "Canada": "CAD", "Cape Verde": "CVE", 
  "Central African Republic": "XAF", "Chad": "XAF", "Chile": "CLP", "China": "CNY",
  "Colombia": "COP", "Comoros": "KMF", "Congo": "CDF", "Costa Rica": "CRC", "Croatia": "EUR",
  "Cuba": "CUP", "Cyprus": "EUR", "Czech Republic": "CZK", "Denmark": "DKK", "Djibouti": "DJF",
  "Dominican Republic": "DOP", "Ecuador": "USD", "Egypt": "EGP", "El Salvador": "USD",
  "Equatorial Guinea": "XAF", "Eritrea": "ERN", "Estonia": "EUR", "Eswatini": "SZL",
  "Ethiopia": "ETB", "Fiji": "FJD", "Finland": "EUR", "France": "EUR", "Gabon": "XAF",
  "Gambia": "GMD", "Georgia": "GEL", "Germany": "EUR", "Ghana": "GHS", "Greece": "EUR",
  "Guatemala": "GTQ", "Guinea": "GNF", "Guyana": "GYD", "Haiti": "HTG", "Honduras": "HNL",
  "Hungary": "HUF", "Iceland": "ISK", "India": "INR", "Indonesia": "IDR", "Iran": "IRR",
  "Iraq": "IQD", "Ireland": "EUR", "Israel": "ILS", "Italy": "EUR", "Jamaica": "JMD",
  "Japan": "JPY", "Jordan": "JOD", "Kazakhstan": "KZT", "Kenya": "KES", "Kiribati": "AUD",
  "Kuwait": "KWD", "Kyrgyzstan": "KGS", "Laos": "LAK", "Latvia": "EUR", "Lebanon": "LBP",
  "Lesotho": "LSL", "Liberia": "LRD", "Libya": "LYD", "Liechtenstein": "CHF", "Lithuania": "EUR",
  "Luxembourg": "EUR", "Madagascar": "MGA", "Malawi": "MWK", "Malaysia": "MYR", "Maldives": "MVR",
  "Mali": "XOF", "Malta": "EUR", "Mexico": "MXN", "Moldova": "MDL", "Monaco": "EUR",
  "Mongolia": "MNT", "Montenegro": "EUR", "Morocco": "MAD", "Mozambique": "MZN", "Myanmar": "MMK",
  "Namibia": "NAD", "Nauru": "AUD", "Nepal": "NPR", "Netherlands": "EUR", "New Zealand": "NZD",
  "Nicaragua": "NIO", "Niger": "XOF", "Nigeria": "NGN", "North Korea": "KPW", 
  "North Macedonia": "MKD", "Norway": "NOK", "Oman": "OMR", "Pakistan": "PKR", "Palau": "USD",
  "Palestine": "ILS", "Panama": "PAB", "Papua New Guinea": "PGK", "Paraguay": "PYG", "Peru": "PEN",
  "Philippines": "PHP", "Poland": "PLN", "Portugal": "EUR", "Qatar": "QAR", "Romania": "RON",
  "Russia": "RUB", "Rwanda": "RWF", "Samoa": "WST", "San Marino": "EUR", "Saudi Arabia": "SAR",
  "Senegal": "XOF", "Serbia": "RSD", "Seychelles": "SCR", "Sierra Leone": "SLL", "Singapore": "SGD",
  "Slovakia": "EUR", "Slovenia": "EUR", "Solomon Islands": "SBD", "Somalia": "SOS",
  "South Africa": "ZAR", "South Korea": "KRW", "South Sudan": "SSP", "Spain": "EUR",
  "Sri Lanka": "LKR", "Sudan": "SDG", "Suriname": "SRD", "Sweden": "SEK", "Switzerland": "CHF",
  "Syria": "SYP", "Taiwan": "TWD", "Tajikistan": "TJS", "Tanzania": "TZS", "Thailand": "THB",
  "Togo": "XOF", "Tonga": "TOP", "Trinidad and Tobago": "TTD", "Tunisia": "TND", "Turkey": "TRY",
  "Turkmenistan": "TMT", "Tuvalu": "AUD", "Uganda": "UGX", "Ukraine": "UAH",
  "United Arab Emirates": "AED", "United Kingdom": "GBP", "United States": "USD", "Uruguay": "UYU",
  "Uzbekistan": "UZS", "Vanuatu": "VUV", "Vatican City": "EUR", "Venezuela": "VES", "Vietnam": "VND",
  "Yemen": "YER", "Zambia": "ZMW", "Zimbabwe": "ZWL"
}

result = ''
for m in matches:
    name = m.group(1)
    flag = m.group(2)
    cur = curr_map.get(name, 'USD') # default to USD
    result += f'  {{ name: "{name}", flag: "{flag}", currency: "{cur}" }},\n'

final_content = 'export const COUNTRIES = [\n' + result + '];\n'
with open('src/data/countries.ts', 'w') as f:
    f.write(final_content)

