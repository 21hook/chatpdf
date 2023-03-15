import PyPDF2

def parse_pdf(file):
    text = ''
    pdf_reader = PyPDF2.PdfReader(file)
    num_pages = len(pdf_reader.pages)
    # print('Number of pages: {}'.format(num_pages))
    for i in range(num_pages):
        page_obj = pdf_reader.pages[i]
        page = page_obj.extract_text()
        text += page
        # print('Page {}: '.format(i))
        # print(page)
    return text

# Test code:
# parse_pdf('data/Experimental Evidence on the Productivity Effects of Generative Artificial Intelligence.pdf')
# parse_pdf('upload/conda-cheatsheet.pdf')
# with open('upload/conda-cheatsheet.pdf', 'rb') as f:
#     parse_pdf(f)
