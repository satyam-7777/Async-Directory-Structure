import { describe, it, expect, vi } from "vitest";
import { getRootDirectoryData, getDirectoryFiles, getAllFiles } from "../client";

describe("getRootDirectoryData", () => {
  it("should return all the files and directory data from root folder successfully", async () => {
    const mockValue = {
      items: [
        { name: "file1", isDir: false },
        { name: "dir1", isDir: true },
      ],
    };
    const baseUrl = "http://localhost:3000";
    const fetchImpl = vi.fn();
    fetchImpl.mockResolvedValue({ ok: true, json: async () => mockValue });

    const result = await getRootDirectoryData(baseUrl, fetchImpl);

    expect(result).toEqual(mockValue);
    expect(fetchImpl).toHaveBeenCalledWith(baseUrl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("should throw error when api call fails", async () => {
    const baseUrl = "http://localhost:3000";
    const fetchImpl = vi.fn();
    fetchImpl.mockResolvedValue({ ok: false, status: 500 });

    await expect(getRootDirectoryData(baseUrl, fetchImpl)).rejects.toThrow(
      "error occured while fetching the data",
    );

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith(baseUrl);
  });
});

describe("getDirectoryFiles", () => {
  const baseUrl = "http://localhost:3000";
  it("should return all the files from directory successfully", async () => {
    const mockValue = {
      name: "dir1",
      isDir: true,
      files: [
        { name: "file2", isDir: false },
        { name: "file3", isDir: false },
        { name: "file4", isDir: false },
      ],
    };

    const fetchImpl = vi.fn();
    fetchImpl.mockResolvedValue({
      ok: true,
      json: async () => mockValue,
    });

    const directoryName = "dir1";
    const url = baseUrl + "/" + directoryName;

    const result = await getDirectoryFiles(baseUrl, fetchImpl, directoryName);

    expect(result).toEqual(mockValue);
    expect(fetchImpl).toHaveBeenCalledWith(url);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("should throw error when api call fails", async () => {
    const fetchImpl = vi.fn();
    fetchImpl.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getDirectoryFiles(baseUrl, fetchImpl, "dir1")).rejects.toThrow(
      "error occured while fetching the directory data",
    );

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith(baseUrl + "/dir1");
  });
});

describe("getAllFiles", () => {
  const baseUrl = "http://localhost:3000";
  it("should return all the files from root and child directories", async () => {
    const fetchImpl = vi.fn();
    const getRootDirectoryDataFn = vi.fn();
    const getDirectoryFilesFn = vi.fn();

    const rootMockValue = {
      items: [
        { name: "file1", isDir: false },
        { name: "dir1", isDir: true },
      ],
    };

    const childMockValue = {
      name: "dir1",
      isDir: true,
      files: [
        { name: "file2", isDir: false },
        { name: "file3", isDir: false },
        { name: "file4", isDir: false },
      ],
    };

    const resultMockValue = [
      { name: "file1", isDir: false },
      { name: "file2", isDir: false },
      { name: "file3", isDir: false },
      { name: "file4", isDir: false },
    ];
    getRootDirectoryDataFn.mockResolvedValue(rootMockValue);
    getDirectoryFilesFn.mockResolvedValue(childMockValue);

    const result = await getAllFiles(
      baseUrl,
      fetchImpl,
      getRootDirectoryDataFn,
      getDirectoryFilesFn,
    );

    expect(result).toEqual(resultMockValue);
    expect(getRootDirectoryDataFn).toHaveBeenCalledTimes(1);
    expect(getDirectoryFilesFn).toHaveBeenCalledTimes(1);
    expect(getRootDirectoryDataFn).toHaveBeenCalledWith(baseUrl, fetchImpl);
    expect(getDirectoryFilesFn).toHaveBeenCalledWith(baseUrl, fetchImpl, "dir1");
  });

  it("should return only root files when directories are not present in root folder", async () => {
    const fetchImpl = vi.fn();
    const getRootDirectoryDataFn = vi.fn();
    const getDirectoryFilesFn = vi.fn();

    const rootMockValue = {
      items: [
        { name: "file1", isDir: false },
        { name: "file2", isDir: false },
        { name: "file3", isDir: false },
      ],
    };

    const resultMockValue = [
      { name: "file1", isDir: false },
      { name: "file2", isDir: false },
      { name: "file3", isDir: false },
    ];

    getRootDirectoryDataFn.mockResolvedValue(rootMockValue);

    const result = await getAllFiles(
      baseUrl,
      fetchImpl,
      getRootDirectoryDataFn,
      getDirectoryFilesFn,
    );

    expect(result).toEqual(resultMockValue);
    expect(getRootDirectoryDataFn).toHaveBeenCalledTimes(1);
    expect(getRootDirectoryDataFn).toHaveBeenCalledWith(baseUrl, fetchImpl);
    expect(getDirectoryFilesFn).not.toHaveBeenCalled();
  });

  it("should return files from multiple child directories", async () => {
    const fetchImpl = vi.fn();
    const getRootDirectoryDataFn = vi.fn();
    const getDirectoryFilesFn = vi.fn();

    // Mock root directory response
    const rootMockValue = {
      items: [
        { name: "file1", isDir: false },
        { name: "dir1", isDir: true },
        { name: "dir2", isDir: true },
      ],
    };

    // Mock dir1 response
    const dir1MockValue = {
      name: "dir1",
      isDir: true,
      files: [
        { name: "file2", isDir: false },
        { name: "file3", isDir: false },
      ],
    };

    // Mock dir2 response
    const dir2MockValue = {
      name: "dir2",
      isDir: true,
      files: [
        { name: "file4", isDir: false },
        { name: "file5", isDir: false },
      ],
    };

    // Expected result
    const expectedResult = [
      { name: "file1", isDir: false },
      { name: "file2", isDir: false },
      { name: "file3", isDir: false },
      { name: "file4", isDir: false },
      { name: "file5", isDir: false },
    ];

    // Configure mock functions
    getRootDirectoryDataFn.mockResolvedValue(rootMockValue);

    getDirectoryFilesFn.mockResolvedValueOnce(dir1MockValue).mockResolvedValueOnce(dir2MockValue);

    // Execute function
    const result = await getAllFiles(
      baseUrl,
      fetchImpl,
      getRootDirectoryDataFn,
      getDirectoryFilesFn,
    );

    expect(result).toEqual(expectedResult);

    expect(getRootDirectoryDataFn).toHaveBeenCalledTimes(1);

    expect(getDirectoryFilesFn).toHaveBeenCalledTimes(2);

    expect(getDirectoryFilesFn).toHaveBeenNthCalledWith(1, baseUrl, fetchImpl, "dir1");

    expect(getDirectoryFilesFn).toHaveBeenNthCalledWith(2, baseUrl, fetchImpl, "dir2");

    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
