---
title: "Executing Local Code on Google Colab via Dropbox"
category: "development"
keywords: ["Google Colab", "Dropbox", "Sync", "Deep Learning"]
description: "The appearance of Google Colab Pro+ has enabled us to run notebooks in the background and, using Colab as a computing resource has become more realistic. As a result of several trials and errors, I have established my own method of sending and executing code written in the local development environment. This post introduces the procedure and what I tried."
eyecatch: /img/blog_colab_dropbox_integration_01.png
---

![ ](/img/blog_colab_dropbox_integration_01.png)

The appearance of Google Colab Pro+ has enabled us to run notebooks in the background, and using Colab as a computing resource has become more realistic. As a result of several trials and errors, I have established my own method of sending and executing code written in the local development environment. This post introduces the procedure and what I tried.

![ ](/img/blog_colab_dropbox_integration_02.png)

## How to send code to Colab using Dropbox

After creating a folder for the project in the local development environment, create a share link from the Dropbox context menu. If you add dl/ after /sh/ in the link, you will be able to download the contents of the folder in zip format.

I usually write ML code in the relation between dataset and project as 1 and N. I put the dataset outside the project and make a symbolic link to it. Therefore I separate the dataset and the project in Colab as well, and wget/unzip them separately. Since the dataset is not updated often and only needs to be downloaded once, I use -nc for wget and -n for unzip. Both options do not overwrite data if they exist.

```ipynb
!wget -nc -O dataset.zip https://www.dropbox.com/sh/dl/...
!unzip -n -d dataset dataset.zip
```

Since the project will be rewritten and rerun frequently, I allow wget and unzip to overwrite it. The symbolic links in the local development environment should  be overwritten by the directory structure on Colab. After installing necessary packages, I finally execute project scripts.

```ipynb
!wget -O proj.zip https://www.dropbox.com/sh/dl/...
!unzip -o -d proj proj.zip

!ln -fs /content/dataset /content/proj/data/input

!pip install -r requirements.txt

!python /content/proj/code/script/train.py
```

I usually separate data under proj/data/ into input (raw data), working (features, trained models, logs), and output (experimental results and figures). If you want to keep the results on Colab, you can also mount Google Drive and make links for working and output.

## A long yak shaving...

The first thing I tried was to store code and data n Google Drive and mount them in Colab. However, the recent update of the Google Drive application on the Mac (PC) has started recommending file stream, which is treated as Samba external drives on the Mac. Permissions of files unexpectedly change and we cannot use git with this setting. If we turn off this function, we cannot use a selective sync (as far as I know in the current version). Therefore I gave up to use it. I have also tried using Google Drive with sync via Cyberduck. But I was bothered by the issues that deleted files sometimes remain as invisible files.

A Dropbox share link has a ?dl=0 parameter, and if you change it to ?dl=1, you can download the file directly. However, this feature does not work for folders. I accidentally found that adding /sh after /dl enables us to download a folder as a zip file, although this function might not be available in the future.

The biggest advantage of this approach is portability. Since it is just a set of bash commands, if you make a shell script, you can run project code regardless of the location, including AWS, GCP, and a server in the lab. I plan to use this approach for a while when it is allowed in terms of the data size and storing policy.