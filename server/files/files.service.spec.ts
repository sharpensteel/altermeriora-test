import {SequelizeModule} from "@nestjs/sequelize";
import {Test, TestingModule} from '@nestjs/testing';
import {DatabaseModule} from "../database/database.module";
import {randomInt} from "../helpers/random.helper";
import {FileModel} from "./file.model";
import {FilesService} from './files.service';

// @todo  current tests implementation provides coverage, but it's far from optimal

describe('FilesService', () => {
  let filesService: FilesService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        SequelizeModule.forFeature([FileModel]),
      ],
      providers: [
        FilesService,
        FileModel,
      ],
    }).compile();

    filesService = app.get<FilesService>(FilesService);

  });

  afterAll(async () => {
    // @todo: proper clearing of tests fixtures; probably throw-away database for tests
  });


  describe('add', () => {
    it('should add files with unique names', async () => {

      const filename = `ut__${randomInt()}`;

      const file = await filesService.add(Buffer.alloc(42), filename);
      expect(file.filename).toBe(filename);

      const file1 = await filesService.add(Buffer.alloc(42), filename);
      expect(file1.filename).toBe(`${filename}(1)`);

      const file2 = await filesService.add(Buffer.alloc(42), filename);
      expect(file2.filename).toBe(`${filename}(2)`);

    });
  });

  describe('remove', () => {
    it('should remove previously added file', async () => {

      // @todo replace bruteforce with correct mechanism
      const isFileExists = async (id: number) => {
        const filesAll = await filesService.findAll();
        return filesAll.map(file => file.id).includes(id);
      }

      const filename = `ut__${randomInt()}`;

      const file = await filesService.add(Buffer.alloc(42), filename);
      expect(await isFileExists(file.id)).toBe(true);

      await filesService.remove(file.id);
      expect(await isFileExists(file.id)).toBe(false);
    });
  });
});
