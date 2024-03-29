import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

DEPENDENCIES = ["clint", "requests"]

setuptools.setup(
    name="long-cli",  # Replace with your own username
    version="0.0.2",
    author="P Pranav Baburaj",
    author_email="code-roller@googlegroups.com",
    description="A simple esoteric programming language",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/pranavbaburaj/long",
    packages=setuptools.find_packages(),
    install_requires=DEPENDENCIES,
    entry_points={"console_scripts": [
        'long = cli:initialize_long_cli',
    ]},
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)