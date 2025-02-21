# CJA-to-pdf
this code is used to scrape content from CJA documentation and converted it into PDF
1. first went to the CJA documentation any page and extected the urls using this query
   Array.from(document.querySelector("[class='toc-tree']").querySelectorAll("li")).map(li => li.querySelector("a").href)
2. after getting all the urls replace the urls with the urs mention in the code, it will download the pdf file
