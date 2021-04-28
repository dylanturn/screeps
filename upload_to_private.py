import glob
import requests
from io import BytesIO
import zipfile


#mem_zip = BytesIO()
#with zipfile.ZipFile(mem_zip, mode="w",compression=zipfile.ZIP_DEFLATED) as zf:
#    for f in files:
#        zf.writestr(f[0], f[1])


def generate_zip(files):
    mem_zip = BytesIO()

    with zipfile.ZipFile(mem_zip, mode="w") as zf:
        for f in files:
            print(f)
            zf.write(f)

    return mem_zip.getvalue()

file_list = glob.glob("*.js")
print(file_list)
zip_files = generate_zip(file_list)

requests.post('http://192.168.1.210:8081/new', data=zip_files)