class HTML {
  // Destructuring assignment is used here
  // (Unpacking fields from objects passed as a function parameter)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  static tag(
    {
      type = "div",
      classes = [],
      innerHTML = "",
      children = []
    } = {}
  ) {
    let tag = document.createElement(type);

    tag.classList.add(...classes)
    tag.innerHTML = innerHTML;

    children.forEach(child => tag.appendChild(child));

    return tag;
  }

  // Spread syntax is used here
  // (Spread in object literals)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  static div(opts = {}) { return this.tag({ ...opts, type: "div" }); }
  static em(opts = {}) { return this.tag({ ...opts, type: "em" }); }
  static img(opts = {}) { return this.tag({ ...opts, type: "img" }); }
}

class ArtifactRenderer {
  constructor(artifact) {
    this.artifact = artifact;
  }

  render(parent) {
    let container = HTML.div({
      classes: ["infobox-page-container"],
      children: [this.artifact_tag()],
    });

    parent.appendChild(container);
  }

  artifact_tag() {
    return HTML.div({
      classes: ["item-box", "-unique"],
      children: [
        this.header(),
        this.stats(),
        this.price(),
        this.image(),
      ],
    });
  }

  header() {
    return HTML.div({
      classes: ["header", "-double"],
      innerHTML: this.artifact.title,
    });
  }

  stats() {
    return HTML.div({
      classes: ["item-stats"],
      children: [
        this.attributes(),
        this.modifiers(),
        this.flavour(),
      ],
    });
  }

  attributes() {
    let attribute_tags = this.artifact.attributes.map(attribute => {
      return HTML.div({
        children: [
          HTML.em({
            classes: ["tc", "-default"],

            innerHTML: `${attribute.name}: `,

            children: [
              HTML.em({ classes: ["tc", "-value"], innerHTML: attribute.value })
            ]

          })
        ]
      });
    });

    return HTML.div({ classes: ["group"], children: attribute_tags });
  }

  modifiers() {
    let modifier_tags = this.artifact.modifiers.map(modifier => {
      return HTML.div({ innerHTML: modifier });
    });

    return HTML.div({
      classes: ["group", "tc", "-mod"],
      children: modifier_tags,
    });
  }

  flavour() {
    return HTML.div({
      classes: ["group", "tc", "-flavour"],
      innerHTML: this.artifact.flavour_text,
    });
  }

  price() {
    return HTML.div({
      classes: ["group"],
      children: [
        HTML.em({ classes: ["header"], innerHTML: "Price:&nbsp;" }),
        HTML.em({
          classes: ["header", "price"], innerHTML: this.artifact.price
        }),
      ],
    });
  }

  image() {
    let img = HTML.img();
    img.src = this.artifact.image_url;

    return HTML.div({ classes: ["group", "artifact-image"], children: [img] });
  }
}

// Finally, the code! :D
function main() {
  const artifacts_container = document.getElementById("artifacts-container");
  const api_base = "http://localhost:3000"

  const artifacts_url = `${api_base}/artifacts`;

  fetch(artifacts_url)
    .then(response => response.json())
    .then(artifacts => {
      artifacts.forEach(
        artifact => new ArtifactRenderer(artifact).render(artifacts_container)
      );
    });

  const titleInput = document.getElementById("title");
  const armourInput = document.getElementById("armour");
  const flavourInput = document.getElementById("flavour");
  const priceInput = document.getElementById("price");
  const imageInput = document.getElementById("image");

  function artifactFromInputs() {
    return {
      title: titleInput.value,
      attributes: [{ name: "Armour", value: armourInput.value }],
      modifiers: ["+10% to Heart Warmth"],
      flavour_text: flavourInput.value,
      image_url: imageInput.value,
      price: `${priceInput.value} Schmeckles`,
    };
  }

  const previewContainer = document.getElementById("new-artifact-preview");

  function renderArtifactPreview() {
    previewContainer.innerHTML = "";
    new ArtifactRenderer(artifactFromInputs()).render(previewContainer);
  }

  [titleInput, armourInput, flavourInput, priceInput, imageInput]
    .forEach(input => input.addEventListener('change', renderArtifactPreview));

  const form = document.getElementById("new-artifact-form");

  form.addEventListener('submit', event => {
    event.preventDefault();

    const artifact = artifactFromInputs();
    fetch(artifacts_url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artifact)
    });

    new ArtifactRenderer(artifactFromInputs()).render(artifacts_container);
  });
}

main();
