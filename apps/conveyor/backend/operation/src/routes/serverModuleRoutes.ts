import { Router } from 'express';
import * as fs from 'fs';
import { promisify } from 'util';

const router: Router = Router();

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const path = {
    him: `${process.env.SV_LOG_PATH ? process.env.SV_LOG_PATH : '/home/semits/server_bin/appLog'}/him`,
    dcm: `${process.env.SV_LOG_PATH ? process.env.SV_LOG_PATH : '/home/semits/server_bin/appLog'}/dcm`,
};

router.get('/api/him/log/list', async (req, res) => {
    try {
        const filelist = await readdir(path.him);

        if (filelist) {
            return res.status(200).send({
                files: filelist,
            });
        }
        return res.status(401).json({
            message: 'file Load error',
        });
    } catch (ex) {
        return res.status(401).json({
            message: 'file Load error',
        });
    }
});


router.get('/api/him/log/list', async (req, res) => {
    try {
        const filelist = await readdir(path.him);

        if (filelist) {
            return res.status(200).send({
                files: filelist,
            });
        }
        return res.status(401).json({
            message: 'file Load error',
        });
    } catch (ex) {
        return res.status(401).json({
            message: 'file Load error',
        });
    }
});

router.get('/api/him/log', async (req, res) => {
    try {
        const fileName = req.query.fileName;
        let file;
        if (fileName) {
            file = await readFile(`${path.him}/${fileName}`, 'utf-8');
        }

        if (file) {
            res.status(200).send(file);
        } else {
            return res.status(401).json({
                message: 'file Load error',
            });
        }
    } catch (ex) {
        return res.status(401).json({
            message: 'file Load error',
        });
    }
});

router.get('/api/dcm/log/list', async (req, res) => {
    try {
        const filelist = await readdir(path.dcm);

        if (filelist) {
            return res.status(200).send({
                files: filelist,
            });
        }
        return res.status(401).json({
            message: 'file Load error',
        });
    } catch (ex) {
        return res.status(401).json({
            message: 'file Load error',
        });
    }
});

router.get('/api/dcm/log', async (req, res) => {
    try {
        const fileName = req.query.fileName;
        let file;
        if (fileName) {
            file = await readFile(`${path.dcm}/${fileName}`, 'utf-8');
        }

        if (file) {
            res.status(200).send(file);
        } else {
            return res.status(401).json({
                message: 'file Load error',
            });
        }
    } catch (ex) {
        return res.status(401).json({
            message: 'file Load error',
        });
    }
});

export default router;
