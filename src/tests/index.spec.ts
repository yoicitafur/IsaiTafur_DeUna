import { FastifyInstance } from "fastify/types/instance";
import { RepositoryVerificationStatesResponseEnum } from "../application/enums/repository-verification-states-response.enum";
import App from "../app";
import corsPlugin from "../infrastructure/plugins/cors.plugin";
import Routes from "../infrastructure/routes/index.routes";

beforeAll(async () => {
  const server = new App({
    routes: [Routes],
    plugins: [corsPlugin]
  });
  await server.listen();
  global['App'] = server.app;
})

afterAll(() => {
  console.log("Tests have finished");
})

describe('Testing Tribe Module', () => {
  describe('GET /tribes/:tribe_id/repository-metrics', () => {

    test('Get repository metrics by tribe', async() => {
      const server: FastifyInstance = global['App'] as FastifyInstance;
      const tribeId: number = 1;
      const response = await server.inject({ method: 'GET', url: `/tribes/${tribeId}/repository-metrics` });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body).not.toBeNull();
      expect(body).not.toBeUndefined();
      expect(body).toHaveProperty('repositories');
      expect(Array.isArray(body.repositories)).toBeTruthy();
      expect(body.repositories.length).toBeGreaterThan(0);

      const sampleObj = body.repositories[0];
      expect(sampleObj).toHaveProperty('id');
      expect(sampleObj).toHaveProperty('name');
      expect(sampleObj).toHaveProperty('tribe');
      expect(sampleObj).toHaveProperty('organization');
      expect(sampleObj).toHaveProperty('coverage');
      expect(sampleObj).toHaveProperty('codeSmells');
      expect(sampleObj).toHaveProperty('bugs');
      expect(sampleObj).toHaveProperty('vulnerabilities');
      expect(sampleObj).toHaveProperty('hotspots');
      expect(sampleObj).toHaveProperty('verificationState');
      expect(sampleObj).toHaveProperty('state');

      expect(typeof sampleObj.id).toBe('string');
      expect(typeof sampleObj.name).toBe('string');
      expect(typeof sampleObj.tribe).toBe('string');
      expect(typeof sampleObj.organization).toBe('string');
      expect(typeof sampleObj.coverage).toBe('string');
      expect(typeof sampleObj.codeSmells).toBe('number');
      expect(typeof sampleObj.bugs).toBe('number');
      expect(typeof sampleObj.vulnerabilities).toBe('number');
      expect(typeof sampleObj.hotspots).toBe('number');
      expect(typeof sampleObj.verificationState).toBe('string');
      expect(typeof sampleObj.state).toBe('string');
    })

    test('Non-existent tribe', async() => {
      const server: FastifyInstance = global['App'] as FastifyInstance;
      const tribeId: number = 4;
      const response = await server.inject({ method: 'GET', url: `/tribes/${tribeId}/repository-metrics` });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(404);
      expect(body).not.toBeNull();
      expect(body).not.toBeUndefined();
      expect(body).toHaveProperty('error');
      expect(body.error).toHaveProperty('code', 404);
      expect(body.error).toHaveProperty('message', 'La tribu no se encuentra registrada');
    })

    test('Get verifcation state info written in natural language', async() => {
      const server: FastifyInstance = global['App'] as FastifyInstance;
      const tribeId: number = 1;
      const response = await server.inject({ method: 'GET', url: `/tribes/${tribeId}/repository-metrics` });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body).not.toBeNull();
      expect(body).not.toBeUndefined();
      expect(body).toHaveProperty('repositories');
      expect(Array.isArray(body.repositories)).toBeTruthy();
      expect(body.repositories.length).toBeGreaterThan(0);
      const sampleObj = body.repositories[0];
      expect(typeof sampleObj.verificationState).toBe('string');
      expect(Object.values(RepositoryVerificationStatesResponseEnum).includes(sampleObj.verificationState)).toBeTruthy();
    })

    test('Tribe has no repositories that meet the required coverage', async() => {
      const server: FastifyInstance = global['App'] as FastifyInstance;
      const tribeId: number = 2;
      const response = await server.inject({ method: 'GET', url: `/tribes/${tribeId}/repository-metrics` });
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(404);
      expect(body).not.toBeNull();
      expect(body).not.toBeUndefined();
      expect(body).toHaveProperty('error');
      expect(body.error).toHaveProperty('code', 404);
      expect(body.error).toHaveProperty('message', 'La tribu no tiene repositorios que cumplan con la cobertura necesaria');
    })

  })
})
