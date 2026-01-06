import zipfile
import xml.etree.ElementTree as ET

docx_path = 'Financiamento_v5.docx'

try:
    with zipfile.ZipFile(docx_path) as zf:
        xml_content = zf.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        
        # XML namespace/tag for text in Word is w:t
        # Usually {http://schemas.openxmlformats.org/wordprocessingml/2006/main}t
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        text_parts = []
        for node in tree.iter():
            if node.tag.endswith('}t'):
                if node.text:
                    text_parts.append(node.text)
            elif node.tag.endswith('}p'):
                text_parts.append('\n')
        
        full_text = "".join(text_parts)
        print(full_text)
except Exception as e:
    print(f"Error reading docx: {e}")
