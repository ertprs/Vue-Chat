export default {
  state: {
    emojis: [
      {
        hexa: "&#x1f600;",
        emoji: String.fromCodePoint(0x1f600)
      },
      {
        hexa: "&#x1f61c;",
        emoji: String.fromCodePoint(0x1f61c)
      },
      {
        hexa: "&#x1f605;",
        emoji: String.fromCodePoint(0x1f605)
      },
      {
        hexa: "&#x1f602;",
        emoji: String.fromCodePoint(0x1f602)
      },
      {
        hexa: "&#x1f609;",
        emoji: String.fromCodePoint(0x1f609)
      },
      {
        hexa: "&#x1f914;",
        emoji: String.fromCodePoint(0x1f914)
      },
      {
        hexa: "&#x1f928;",
        emoji: String.fromCodePoint(0x1f928)
      },
      {
        hexa: "&#x1f610;",
        emoji: String.fromCodePoint(0x1f610)
      },
      {
        hexa: "&#x1f62c;",
        emoji: String.fromCodePoint(0x1f62c)
      },
      {
        hexa: "&#x1f614;",
        emoji: String.fromCodePoint(0x1f614)
      },
      {
        hexa: "&#x1f62a;",
        emoji: String.fromCodePoint(0x1f62a)
      },
      {
        hexa: "&#x1f912;",
        emoji: String.fromCodePoint(0x1f912)
      },
      {
        hexa: "&#x1f92f;",
        emoji: String.fromCodePoint(0x1f92f)
      },
      {
        hexa: "&#x1f973;",
        emoji: String.fromCodePoint(0x1f973)
      },
      {
        hexa: "&#x1f60e;",
        emoji: String.fromCodePoint(0x1f60e)
      },
      {
        hexa: "&#x1f615;",
        emoji: String.fromCodePoint(0x1f615)
      },
      {
        hexa: "&#x1f641;",
        emoji: String.fromCodePoint(0x1f641)
      },
      {
        hexa: "&#x1f62e;",
        emoji: String.fromCodePoint(0x1F62E)
      }
    ],
    todaBiblioteca: []
  },
  mutations: {
    setBiblioteca(state, emojis){
      state.todaBiblioteca = emojis
    }
  },
  getters: {
    getEmojis(state){
      return state.emojis
    },
    getTodaBliblioteca(state){
      return state.todaBiblioteca
    }
  }
}