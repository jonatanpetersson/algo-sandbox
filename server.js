import express from 'express';

express().use(express.static('dist')).listen(4200);
