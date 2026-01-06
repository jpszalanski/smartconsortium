import sys
import re

try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        print("No pypdf found")
        sys.exit(1)

reader = PdfReader("Financiamento_v7.pdf")
full_text = ""
for page in reader.pages:
    full_text += page.extract_text() + "\n"

# Search for keywords
keywords = ["Custo", "Formula", "Deduzindo", "Invest", "Compar", "Lance", "Consorcio"]
print("--- EXTRACTED TEXT ---")
print(full_text)
print("--- END TEXT ---")
