class HTML {
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
}

main();
