<template>
  <div class="articles">
    <h2>{{ heading }}</h2>
    <div v-for="article in displayedArticles" :key="article.id" class="article">
      {{ article }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      heading: 'HKU-PGSA 港大研會',
      articles: [],
      sheetJson: [],
      sheetTsv: [],
      reusedKey: '',
      lazyLock: false,
      order: 'descending',
      limit: 0,
    };
  },
  computed: {
    displayedArticles() {
      // Apply the limit or show all articles if no limit is set
      return this.limit > 0 ? this.articles.slice(-this.limit) : this.articles;
    },
  },
  created() {
    const params = this.getQueryFromURL(window.location.href);
    this.initializeParams(params);
    if (this.lazyLock) return;

    if (this.sheetTsv.length === 3 || this.sheetJson.length === 3) {
      this.fetchSheetData(params);
    } else {
      this.loadArticles(this.articles);
    }
  },
  methods: {
    getQueryFromURL(url) {
      const query = url.split('?')[1] || '';
      return Object.fromEntries(new URLSearchParams(query));
    },
    initializeParams(params) {
      this.heading = params.heading ? decodeURIComponent(params.heading) : this.heading;
      this.order = params.order || this.order;
      this.limit = params.limit ? parseInt(params.limit) : this.limit;
      this.sheetJson = params.json ? params.json.split(',') : [];
      this.sheetTsv = params.tsv ? params.tsv.split(',') : [];
      this.reusedKey = params.reused || '';
      this.articles = params.articles ? params.articles.split(params.sep || ',') : [];
    },
    fetchSheetData(params) {
      const _sep = params.sep || ',';
      let ajaxUrl = null;
      let ajaxCallback = null;

      if (this.sheetTsv.length === 3) {
        const [ssId, sNum, cell] = this.sheetTsv;
        ajaxUrl = `/spreadsheets/d/e/${ssId}/pub?gid=${sNum}&single=true&output=tsv`;
        ajaxCallback = (data) => {
          const table = {};
          data.split(/\r?\n/).forEach((line, ri) => {
            line.split('\t').forEach((e, cj) => {
              if (e) table[`R${ri + 1}C${cj + 1}`] = e;
            });
          });
          return table[cell] || '';
        };
      } else if (this.sheetJson.length === 3) {
        const [ssId, sNum, cell] = this.sheetJson;
        ajaxUrl = `/feeds/cells/${ssId}/${sNum}/public/basic/${cell}?alt=json`;
        ajaxCallback = (data) => {
          const parsedData = JSON.parse(data);
          return parsedData.entry.content.$t;
        };
      }

      if (ajaxUrl) {
        this.fetchData(ajaxUrl, ajaxCallback, _sep);
      }
    },
    async fetchData(url, callback, separator) {
      try {
        const response = await fetch(url);
        const data = await response.text();
        const result = callback(data).split(separator);
        this.articles = [...new Set(result)];
        this.loadArticles(this.articles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    loadArticles(articles) {
      this.lazyLock = true;

      // Map each article to display format or fetch further details if required
      const processedArticles = articles.map((article) => this.retrieveArticle(article));
      this.articles = processedArticles;

      this.lazyLock = false;
    },
    retrieveArticle(id) {
      // Simulate fetching or processing the article
      return { id, title: `Article ${id}` };
    },
  },
};
</script>

<style>
.articles {
  font-family: Arial, sans-serif;
}

.article {
  margin: 10px 0;
}
</style>
