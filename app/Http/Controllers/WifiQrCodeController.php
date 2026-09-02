<?php

namespace App\Http\Controllers;

use App\Domains\Unify\UnifyClient;
use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Data\QRMatrix;
use chillerlan\QRCode\Output\QRGdImagePNG;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Symfony\Component\HttpFoundation\Response;

class WifiQrCodeController extends Controller
{
    public function show(UnifyClient $client): Response
    {
        $broadcast = $client->getWifiBroadcast();

        $payload = sprintf(
            'WIFI:T:WPA;S:%s;P:%s;H:%s;;',
            $this->escape($broadcast->ssid),
            $this->escape($broadcast->password),
            $broadcast->hidden ? 'true' : 'false',
        );

        $options = new QROptions([
            'outputInterface' => QRGdImagePNG::class,
            'eccLevel' => EccLevel::H,
            'scale' => 10,
            'drawCircularModules' => true,
            'circleRadius' => 0.4,
            'keepAsSquare' => [QRMatrix::M_FINDER, QRMatrix::M_FINDER_DOT],
            'addLogoSpace' => true,
            'logoSpaceWidth' => 13,
            'logoSpaceHeight' => 13,
            'returnResource' => true,
        ]);

        $image = (new QRCode($options))->render($payload);

        return response($this->addLogo($image), Response::HTTP_OK)
            ->header('Content-Type', 'image/png');
    }

    private function escape(string $value): string
    {
        return preg_replace('/([\\\\;,":])/', '\\\\$1', $value);
    }

    private function addLogo(\GdImage $image): string
    {
        $logo = imagecreatefrompng(public_path('images/logo_qrcode.png'));

        $qrSize = imagesx($image);
        $logoSize = intval($qrSize * 0.22);
        $offset = intval(($qrSize - $logoSize) / 2);

        imagecopyresampled(
            $image,
            $logo,
            $offset,
            $offset,
            0,
            0,
            $logoSize,
            $logoSize,
            imagesx($logo),
            imagesy($logo),
        );

        ob_start();
        imagepng($image);

        return ob_get_clean();
    }
}
