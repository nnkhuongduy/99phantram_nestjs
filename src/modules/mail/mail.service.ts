import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/schemas/user.schema';
import { SupplyDocument } from 'src/schemas/supply.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MailService implements OnModuleInit {
  private _transport: Transporter;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this._transport = createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USERNAME'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  private _streamToString(stream: ReadStream): Promise<string> {
    const chunks = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  private async _sendSupply(
    supply: SupplyDocument,
    filename: string,
    subject: string,
  ) {
    const user = await this.userModel.findById(supply.owner);

    if (!user)
      throw new NotFoundException({
        success: false,
        code: 404,
        message: 'Không tìm thấy người dùng!',
      });

    const str = createReadStream(
      join(process.cwd(), 'src', 'templates', filename),
    );
    const templateText = await this._streamToString(str);
    var body = templateText;

    body = body.replace('{{ supply_name }}', supply.name);
    body = body.replace('{{ archive_reason }}', supply.reason);
    body = body.replace('{{ reject_reason }}', supply.reason);

    this._transport.sendMail({
      from: 'noreply@99phantram.com',
      to: user.email,
      subject,
      html: body,
    });
  }

  async sendRegistrationVerification(user: UserDocument) {
    const str = createReadStream(
      join(process.cwd(), 'src', 'templates', 'verification.html'),
    );
    const templateText = await this._streamToString(str);
    const body = templateText.replace(
      '{{ verification_link }}',
      `${this.configService.get<string>('HOSTNAME')}/verification/${user._id}`,
    );

    this._transport.sendMail({
      from: 'noreply@99phantram.com',
      to: user.email,
      subject: 'Xác nhận tài khoản 99phantram',
      html: body,
    });
  }

  async sendSupplySubmitted(supply: SupplyDocument) {
    await this._sendSupply(
      supply,
      'supply-submitted.html',
      'Bài đăng sản phẩm của bạn đã được gửi về 99PhầnTrăm!',
    );
  }

  async sendSupplyToActive(supply: SupplyDocument) {
    await this._sendSupply(
      supply,
      'supply-active.html',
      'Bài đăng sản phẩm của bạn đã được kiểm duyệt thành công!',
    );
  }

  async sendSupplyToDeclined(supply: SupplyDocument) {
    await this._sendSupply(
      supply,
      'supply-declined.html',
      'Bài đăng sản phẩm của bạn đã bị từ chối!',
    );
  }

  async sendSupplyToArchive(supply: SupplyDocument) {
    await this._sendSupply(
      supply,
      'supply-archived.html',
      'Bài đăng sản phẩm của bạn đã bị xóa!',
    );
  }
}
