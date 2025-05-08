using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace btmc
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // Initialize BTMC mode
            ToggleSwitch.IsChecked = true;
            UpdateView();

            // Ensure placeholders are correctly shown at startup
            ApplyPlaceholder(InputBox);
            ApplyPlaceholder(OutputBox);
            ApplyPlaceholder(Input1Box);
            ApplyPlaceholder(Input2Box);
            ApplyPlaceholder(TernOutputBox);
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
                DragMove();
        }

        private void BtnMinimize_Click(object sender, RoutedEventArgs e)
            => WindowState = WindowState.Minimized;

        private void BtnClose_Click(object sender, RoutedEventArgs e)
            => Close();

        private void ToggleSwitch_Click(object sender, RoutedEventArgs e)
            => UpdateView();

        private void UpdateView()
        {
            if (ToggleSwitch.IsChecked == true)
            {
                InputSection.Visibility = Visibility.Visible;
                ReverseButton.Visibility = Visibility.Visible;
                OutputSection.Visibility = Visibility.Visible;
                TERNSection.Visibility = Visibility.Collapsed;
            }
            else
            {
                InputSection.Visibility = Visibility.Collapsed;
                ReverseButton.Visibility = Visibility.Collapsed;
                OutputSection.Visibility = Visibility.Collapsed;
                TERNSection.Visibility = Visibility.Visible;
            }
        }

        private void BtnClean_Click(object sender, RoutedEventArgs e)
        {
            if (ToggleSwitch.IsChecked == true)
            {
                InputBox.Clear();
                OutputBox.Clear();
                InputModeCombo.SelectedIndex = 0;
                OutputModeCombo.SelectedIndex = 0;
                ApplyPlaceholder(InputBox);
                ApplyPlaceholder(OutputBox);
            }
            else
            {
                Input1Box.Clear();
                Input2Box.Clear();
                TernInstructionCombo.SelectedIndex = 0;
                TernOutputBox.Clear();
                ApplyPlaceholder(Input1Box);
                ApplyPlaceholder(Input2Box);
                ApplyPlaceholder(TernOutputBox);
            }
        }

        private void BtnCopyInput1_Click(object sender, RoutedEventArgs e)
        {
            Clipboard.SetText((ToggleSwitch.IsChecked == true) ? InputBox.Text : Input1Box.Text);
        }

        private void BtnPasteInput1_Click(object sender, RoutedEventArgs e)
        {
            if (!Clipboard.ContainsText()) return;
            var txt = Clipboard.GetText();
            if (ToggleSwitch.IsChecked == true) InputBox.Text = txt;
            else Input1Box.Text = txt;
        }

        private void BtnCopyInput2_Click(object sender, RoutedEventArgs e)
            => Clipboard.SetText(Input2Box.Text);

        private void BtnPasteInput2_Click(object sender, RoutedEventArgs e)
        {
            if (!Clipboard.ContainsText()) return;
            Input2Box.Text = Clipboard.GetText();
        }

        private void BtnSwapInputs_Click(object sender, RoutedEventArgs e)
        {
            var tmp = InputBox.Text;
            InputBox.Text = OutputBox.Text;
            OutputBox.Text = tmp;
        }

        private void BtnCopyOutput_Click(object sender, RoutedEventArgs e)
        {
            Clipboard.SetText((ToggleSwitch.IsChecked == true) ? OutputBox.Text : TernOutputBox.Text);
        }

        private void BtnPasteOutput_Click(object sender, RoutedEventArgs e)
        {
            if (!Clipboard.ContainsText()) return;
            var txt = Clipboard.GetText();
            if (ToggleSwitch.IsChecked == true) OutputBox.Text = txt;
            else TernOutputBox.Text = txt;
        }

        private void BtnConvert_Click(object sender, RoutedEventArgs e)
        {
            if (ToggleSwitch.IsChecked != true) return;

            if (!int.TryParse(InputBox.Text, out var val))
            {
                OutputBox.Text = "Invalid input";
                return;
            }

            if (!(InputModeCombo.SelectedItem is ComboBoxItem sel) ||
                sel.Content.ToString() == "select")
            {
                OutputBox.Text = "Select instruction";
                return;
            }

            OutputBox.Text = val.ToString();
        }

        // --- Placeholder support --------------------------------------------

        private void TextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            var tb = (TextBox)sender;
            if (tb.Text == (string)tb.Tag)
            {
                tb.Text = "";
                tb.Foreground = Brushes.White;
            }
        }

        private void TextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            var tb = (TextBox)sender;
            if (string.IsNullOrWhiteSpace(tb.Text))
                ApplyPlaceholder(tb);
        }

        private void ApplyPlaceholder(TextBox tb)
        {
            tb.Text = (string)tb.Tag;
            tb.Foreground = Brushes.Gray;
        }
    }
}
