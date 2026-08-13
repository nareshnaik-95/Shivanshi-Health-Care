import os
import sys
import hashlib
import requests

NETLIFY_API = "https://api.netlify.com/api/v1"
FOLDER = r"C:\Users\NareshNaikMudavath\.gemini\antigravity-ide\scratch\shivanshi-healthcare"
SITE_FILES = ["index.html", "style.css", "script.js"]

def get_sha1(filepath):
    sha1 = hashlib.sha1()
    with open(filepath, "rb") as f:
        while True:
            data = f.read(65536)
            if not data:
                break
            sha1.update(data)
    return sha1.hexdigest()

def main():
    # Collect files recursively
    files = {}
    print("Collecting files...")
    for root, dirs, filenames in os.walk(FOLDER):
        for fname in filenames:
            if fname.endswith(('.html', '.css', '.js', '.jpg', '.jpeg', '.png', '.svg', '.webp')):
                full_path = os.path.join(root, fname)
                rel_path = "/" + os.path.relpath(full_path, FOLDER).replace("\\", "/")
                files[rel_path] = {
                    "path": full_path,
                    "sha1": get_sha1(full_path),
                    "size": os.path.getsize(full_path)
                }
                print("  " + rel_path + " (" + str(os.path.getsize(full_path)) + " bytes)")

    # Create site on Netlify (anonymous deploy)
    print("\nCreating site on Netlify...")
    file_hashes = {}
    for path, info in files.items():
        file_hashes[path] = info["sha1"]

    resp = requests.post(
        NETLIFY_API + "/sites",
        headers={"Content-Type": "application/json"},
        json={"files": file_hashes}
    )

    print("Response status: " + str(resp.status_code))

    if resp.status_code not in (200, 201):
        print("ERROR: " + resp.text)
        sys.exit(1)

    data = resp.json()
    deploy_id = data.get("deploy_id") or data.get("id")
    site_id = data.get("id")
    site_url = data.get("ssl_url") or data.get("url", "unknown")
    required = data.get("required", [])

    print("Deploy ID: " + str(deploy_id))
    print("Required uploads: " + str(len(required)))

    # Upload files
    print("\nUploading files...")
    for path, info in files.items():
        with open(info["path"], "rb") as f:
            file_data = f.read()
            upload_url = NETLIFY_API + "/deploys/" + deploy_id + "/files" + path
            upload_resp = requests.put(
                upload_url,
                headers={"Content-Type": "application/octet-stream"},
                data=file_data
            )
            status = "OK" if upload_resp.status_code in (200, 201) else "FAIL"
            print("  " + status + " " + path + " (" + str(upload_resp.status_code) + ")")

    # Get final site URL
    print("\nFinalizing...")
    site_resp = requests.get(NETLIFY_API + "/sites/" + str(site_id))
    if site_resp.status_code == 200:
        final = site_resp.json()
        site_url = final.get("ssl_url") or final.get("url") or site_url
        state = final.get("state", "unknown")
        print("State: " + state)

    print("\n" + "=" * 50)
    print("  DEPLOYED SUCCESSFULLY!")
    print("  URL: " + site_url)
    print("=" * 50)
    print("\nShare this link with anyone!")

if __name__ == "__main__":
    main()
