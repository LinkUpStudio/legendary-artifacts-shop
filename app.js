class ArtifactRendedrer {
  static buildTag(
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

  constructor(artifact) {
    this.artifact = artifact;
  }

  render(parent_div) {
    let container_div = ArtifactRendedrer.buildTag({
      classes: ["infobox-page-container"],
      children: [this.buildArtifact_div()],
    });

    parent_div.appendChild(container_div);
  }

  buildArtifact_div() {
    return ArtifactRendedrer.buildTag({
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
    return ArtifactRendedrer.buildTag({
      classes: ["header", "-double"],
      innerHTML: this.artifact.title,
    });
  }

  buildStats_div() {
    return ArtifactRendedrer.buildTag({
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
      return ArtifactRendedrer.buildTag({
        children: [
          ArtifactRendedrer.buildTag({
            type: "em",
            classes: ["tc", "-default"],

            innerHTML: `${attribute.name}: `,

            children: [
              ArtifactRendedrer.buildTag({
                type: "em",
                classes: ["tc", "-value"],
                innerHTML: attribute.value
              })
            ]

          })
        ]
      });
    });

    return ArtifactRendedrer.buildTag({
      classes: ["group"],
      children: attribute_divs,
    });
  }

  buildModifiers_div() {
    let modifier_divs = this.artifact.modifiers.map(modifier => {
      return ArtifactRendedrer.buildTag({
        innerHTML: modifier
      });
    });

    return ArtifactRendedrer.buildTag({
      classes: ["group", "tc", "-mod"],
      children: modifier_divs,
    });
  }

  buildFlavour_div() {
    return ArtifactRendedrer.buildTag({
      classes: ["group", "tc", "-flavour"],
      innerHTML: this.artifact.flavour_text,
    });
  }

  buildPrice_div() {
    return ArtifactRendedrer.buildTag({
      classes: ["group"],
      children: [
        ArtifactRendedrer.buildTag({
          type: "em", classes: ["header"], innerHTML: "Price:&nbsp;"
        }),
        ArtifactRendedrer.buildTag({
          type: "em", classes: ["header", "price"], innerHTML: this.artifact.price
        }),
      ],
    });
  }

  buildImage_div() {
    let img = ArtifactRendedrer.buildTag({type: "img"});
    img.src = this.artifact.image_url;

    return ArtifactRendedrer.buildTag({
      classes: ["group", "artifact-image"],
      children: [img],
    });
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
        new ArtifactRendedrer(artifact).render(ARTIFACTS_CONTAINER_DIV)
    );
  });
