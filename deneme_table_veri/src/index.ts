import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';
import cors from 'cors';

const schema = buildSchema(`
  type Post {
    userId: Int
    id: Int
    title: String
    body: String
  }

  type PostResponse {
    data: [Post]
    totalRecords: Int
  }

  type Query {
    posts(
      page: Int
      limit: Int
      userId: String
      id: String
      title: String
      body: String
      searchText: String
      sortField: String
      sortOrder: Int
    ): PostResponse
  }
`);

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
const root = {
  posts: async ({
    page = 1,
    limit = 10,
    userId,
    id,
    title,
    body,
    searchText,
    sortField,
    sortOrder,
  }: {
    page?: number;
    limit?: number;
    userId?: string;
    id?: string;
    title?: string;
    body?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: number;
  }) => {
    try {
      const response = await axios.get<Post[]>(
        'https://jsonplaceholder.typicode.com/posts',
      );
      let filteredData = response.data;

      // id filter
      if (id) {
        // ID range
        if (id.includes('-')) {
          const [start, end] = id.split('-').map(Number);
          filteredData = filteredData.filter(
            (post) => post.id >= start && post.id <= end,
          );
        } else {
          // Tek ID
          filteredData = filteredData.filter(
            (post) => post.id === parseInt(id, 10),
          );
        }
      }

      // User ID filter
      if (userId) {
        filteredData = filteredData.filter(
          (post) => post.userId === parseInt(userId, 10),
        );
      }
      // Title Search
      if (title) {
        const titleSearchText = title.toLowerCase();
        filteredData = filteredData.filter((post) =>
          post.title.toLowerCase().includes(titleSearchText),
        );
      }

      // body Search
      if (body) {
        const bodySearchText = body.toLowerCase();
        filteredData = filteredData.filter((post) =>
          post.body.toLowerCase().includes(bodySearchText),
        );
      }

      // Search
      if (searchText) {
        const globalSearchText = searchText.toLowerCase();
        filteredData = filteredData.filter(
          (post) =>
            post.title.toLowerCase().includes(globalSearchText) ||
            post.body.toLowerCase().includes(globalSearchText),
        );
      }

      // Sıralama
      if (sortField && sortOrder) {
        filteredData.sort((a, b) => {
          const aValue = a[sortField as keyof Post];
          const bValue = b[sortField as keyof Post];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder * aValue.localeCompare(bValue);
          }
          return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * sortOrder;
        });
      }

      // Paging
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return {
        data: filteredData.slice(startIndex, endIndex),
        totalRecords: filteredData.length,
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Error fetching data');
    }
  },
};

const app = express();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(4000, () => console.log('http://localhost:4000/graphql'));
