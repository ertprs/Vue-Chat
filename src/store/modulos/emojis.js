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
      },
      {
        hexa: "&#x1F44D;",
        emoji: String.fromCodePoint(0x1F44D)
      },
      {
        hexa: "&#x1F44F;",
        emoji: String.fromCodePoint(0x1F44F)
      },
      {
        hexa: "&#x231B;",
        emoji: String.fromCodePoint(0x231B)
      },
      {
        hexa: "&#x261D;",
        emoji: String.fromCodePoint(0x261D)
      },
      {
        hexa: "&#x2614;",
        emoji: String.fromCodePoint(0x2614)
      },
      {
        hexa: "&#x26A1;",
        emoji: String.fromCodePoint(0x26A1)
      },
      {
        hexa: "&#x270B;",
        emoji: String.fromCodePoint(0x270B)
      },
      {
        hexa: "&#x2714;",
        emoji: String.fromCodePoint(0x2714)
      },
      {
        hexa: "&#x2B50;",
        emoji: String.fromCodePoint(0x2B50)
      },
      {
        hexa: "&#x1F30E;",
        emoji: String.fromCodePoint(0x1F30E)
      },
      {
        hexa: "&#x1F385;",
        emoji: String.fromCodePoint(0x1F385)
      },
      {
        hexa: "&#x1F389;",
        emoji: String.fromCodePoint(0x1F389)
      },
      {
        hexa: "&#x1F38A;",
        emoji: String.fromCodePoint(0x1F38A)
      },
      {
        hexa: "&#x1F3C6;",
        emoji: String.fromCodePoint(0x1F3C6)
      },
      {
        hexa: "&#x1F44B;",
        emoji: String.fromCodePoint(0x1F44B)
      },
      {
        hexa: "&#x1F4B0;",
        emoji: String.fromCodePoint(0x1F4B0)
      },
      {
        hexa: "&#x1F4CC;",
        emoji: String.fromCodePoint(0x1F4CC)
      },
      {
        hexa: "&#x1F4CE;",
        emoji: String.fromCodePoint(0x1F4CE)
      },
      {
        hexa: "&#x1F4D1;",
        emoji: String.fromCodePoint(0x1F4D1)
      },
      {
        hexa: "&#x1F4E2;",
        emoji: String.fromCodePoint(0x1F4E2)
      },
      {
        hexa: "&#x1F4E7;",
        emoji: String.fromCodePoint(0x1F4E7)
      }
      // {
      //   hexa: "&#x",
      //   emoji: String.fromCodePoint(0x)
      // }
      // {
      //   hexa: "&#x",
      //   emoji: String.fromCodePoint(0x)
      // }
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