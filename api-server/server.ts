import express, { Request } from 'express';
import cors from 'cors';
import { sign } from 'jsonwebtoken';
import fs from 'fs';
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

let url_avatar = 'https://picsum.photos/200';
// 'http://localhost:5019/uploads/AvatarUser_'+userId+'.png'

const user = {
    userId: "1",
    username: 'admin',
    avatar: url_avatar,
};

const filter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("File type not supported!"), false);
    }
};

const uploads = multer({
    storage: storage,
    fileFilter: filter
});


const app = express();
app.use(cors());
app.use(express.json());
app.use('/', express.static('uploads'));

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

let files = [];


app.post('/login', (req, res) => {
    // console.log("login => /login");
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const access_token = sign(user, 'secret', { expiresIn: '1h' });
        const expiredAt = new Date("2025-12-31");
        res.json({
            ...user,
            accessToken: access_token,
            expiredAt: expiredAt
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials!' });
    }
});

// getMe
app.get('/users/:userId', (req, res) => {
    // console.log("getMe => /users/:userId");
    const { userId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];

    if (userId === '1') {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials!' });
    }
});


app.get('/uploads/:nomeFoto', (req, res) => {
    // console.log("downloadAvatar => /uploads/:nomeFoto");
    const { nomeFoto } = req.params;
    const stream = fs.createReadStream('uploads/' + nomeFoto);
    // download file as "hello.png"
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=" + nomeFoto,
    });
    stream.on('open', () => {
        // console.log('Opened');
        stream.pipe(res);
    });
    stream.on('close', () => {
        // console.log('Closed');
    });
});


app.post('/users/:userId/upload', uploads.single('file'), (req, res) => {
    // console.log("uploadAvatar => /users/:userId/upload");
    const { userId } = req.params;
    const { authorization } = req.headers
    const token = authorization?.split(' ')[1];

    const filename = req.file?.filename; // file uploaded
    // const filename = "AvatarUser_" + userId + ".png"; // file uploaded

    files.push(filename);

    if (userId === '1') {
        user.avatar = 'http://localhost:5019/uploads/' + filename;
        res.status(200).json({
            url: user.avatar
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials!' });
    }
});

app.listen(5019, () => {
    console.log('Server listening on port 5019');
});

