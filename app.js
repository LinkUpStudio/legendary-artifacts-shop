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

  render(parent_div) {
    let container_div = HTML.div({
      classes: ["infobox-page-container"],
      children: [this.buildArtifact_div()],
    });

    parent_div.appendChild(container_div);
  }

  buildArtifact_div() {
    return HTML.div({
      classes: ["item-box", "-unique"],
      children: [
        this.buildHeader_div(),
        this.buildStats_div(),
        this.buildPrice_div(),
        this.buildImage_div(),
      ],
    });
  }

  buildHeader_div() {
    return HTML.div({
      classes: ["header", "-double"],
      innerHTML: this.artifact.title,
    });
  }

  buildStats_div() {
    return HTML.div({
      classes: ["item-stats"],
      children: [
        this.buildAttributes_div(),
        this.buildModifiers_div(),
        this.buildFlavour_div(),
      ],
    });
  }

  buildAttributes_div() {
    let attribute_divs = this.artifact.attributes.map(attribute => {
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

    return HTML.div({ classes: ["group"], children: attribute_divs });
  }

  buildModifiers_div() {
    let modifier_divs = this.artifact.modifiers.map(modifier => {
      return HTML.div({ innerHTML: modifier });
    });

    return HTML.div({
      classes: ["group", "tc", "-mod"],
      children: modifier_divs,
    });
  }

  buildFlavour_div() {
    return HTML.div({
      classes: ["group", "tc", "-flavour"],
      innerHTML: this.artifact.flavour_text,
    });
  }

  buildPrice_div() {
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

  buildImage_div() {
    let img = HTML.img();
    img.src = this.artifact.image_url;

    return HTML.div({ classes: ["group", "artifact-image"], children: [img] });
  }
}

const ARTIFACTS_CONTAINER_DIV = document.getElementById("artifacts-container");
const API_BASE = "http://localhost:3000"

let url = `${API_BASE}/artifacts`;

fetch(url)
  .then(response => response.json())
  .then(artifacts => {
    artifacts.forEach(
      artifact =>
        new ArtifactRenderer(artifact).render(ARTIFACTS_CONTAINER_DIV)
    );
  });
